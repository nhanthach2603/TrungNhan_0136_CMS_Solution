import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
import sys

BASE_URL = "https://mayanh24h.com"
DELAY = 1.5
PRODUCTS_PER_CATEGORY = 25
OUTPUT_DIR = r"E:\aps.net"
IMAGES_DIR = r"E:\aps.net\CMS.Backend\wwwroot\uploads\products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}

CATEGORIES = [
    {"id": 1, "name": "May anh DSLR", "slug": "may-anh-dslr", "url": "/may-anh-dslr.html"},
    {"id": 2, "name": "Ong kinh may anh", "slug": "ong-kinh", "url": "/ong-kinh-may-anh.html"},
    {"id": 3, "name": "Phu kien may anh", "slug": "phu-kien", "url": "/phu-kien-may-anh.html"},
    {"id": 4, "name": "May quay - Camera Action", "slug": "may-quay", "url": "/may-quay-camera-action-flycam.html"},
    {"id": 5, "name": "May in", "slug": "may-in", "url": "/may-in.html"},
    {"id": 6, "name": "Do choi cong nghe", "slug": "do-cong-nghe", "url": "/do-cong-nghe.html"},
]

session = requests.Session()
session.headers.update(HEADERS)


def fetch_page(url):
    try:
        resp = session.get(url, timeout=15)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  [ERROR] Fetch failed: {url} -> {e}")
        return None


def parse_price(text):
    if not text:
        return None
    text = text.strip().replace("đ", "").replace(".", "").replace(",", "").strip()
    nums = re.findall(r"\d+", text)
    if nums:
        return int(nums[0])
    return None


def get_product_urls(category_url, max_products):
    html = fetch_page(category_url)
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    product_cards = soup.select(".product-item")

    urls = []
    for card in product_cards[:max_products]:
        link = card.select_one(".product-title a")
        if link and link.get("href"):
            href = link["href"]
            if not href.startswith("http"):
                href = BASE_URL + href
            urls.append(href)
    return urls


def download_image(img_url, save_dir, filename):
    try:
        if not img_url:
            return None
        if img_url.startswith("//"):
            img_url = "https:" + img_url
        elif not img_url.startswith("http"):
            img_url = BASE_URL + img_url

        ext = os.path.splitext(filename)[1] or ".jpg"
        if not ext.startswith("."):
            ext = ".jpg"
        safe_name = re.sub(r'[<>:"/\\|?*]', "_", filename)[:80]
        filepath = os.path.join(save_dir, safe_name + ext)

        if os.path.exists(filepath):
            return "/uploads/products/" + os.path.relpath(filepath, IMAGES_DIR).replace("\\", "/")

        resp = session.get(img_url, timeout=15)
        resp.raise_for_status()

        os.makedirs(save_dir, exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(resp.content)

        return "/uploads/products/" + os.path.relpath(filepath, IMAGES_DIR).replace("\\", "/")
    except Exception as e:
        print(f"  [WARN] Image download failed: {img_url} -> {e}")
        return None


def scrape_product_detail(url, cat_slug, cat_id):
    html = fetch_page(url)
    if not html:
        return None

    soup = BeautifulSoup(html, "html.parser")
    product = {"url": url, "categoryId": cat_id, "categorySlug": cat_slug}

    # Try JSON-LD first (most reliable)
    json_ld = soup.select_one('script[type="application/ld+json"]')
    if json_ld:
        try:
            jd = json.loads(json_ld.string)
            product["name"] = jd.get("name", "").strip()
            product["description"] = jd.get("description", "")
            if jd.get("sku"):
                product["sku"] = jd["sku"]
            brand = jd.get("brand", {})
            if brand.get("name"):
                product["brand"] = brand["name"]
            offers = jd.get("offers", {})
            if offers.get("price"):
                product["price"] = int(float(offers["price"]))
            if jd.get("image"):
                images = jd["image"]
                if isinstance(images, list) and images:
                    product["imageUrl"] = images[0]
                elif isinstance(images, str):
                    product["imageUrl"] = images
        except json.JSONDecodeError:
            pass

    # Fallback: parse from HTML
    if not product.get("name"):
        h1 = soup.select_one("h1.text_1") or soup.select_one("h1")
        if h1:
            product["name"] = h1.get_text(strip=True)

    if not product.get("price"):
        price_el = soup.select_one("h3.text-primary.font-weight-bold")
        if price_el:
            product["price"] = parse_price(price_el.get_text())

    if not product.get("description"):
        desc_el = soup.select_one(".desc-induction")
        if desc_el:
            product["description"] = str(desc_el)

    # Original price
    for el in soup.select(".text-secondary"):
        text = el.get_text()
        if "thi truong" in text.lower() or "goc" in text.lower():
            orig = parse_price(text)
            if orig:
                product["originalPrice"] = orig
                break

    # Images from gallery
    if not product.get("imageUrl"):
        img_el = soup.select_one(".gallery-slide .img-view")
        if img_el:
            product["imageUrl"] = img_el.get("data-src", "")

    # All gallery images
    gallery_images = []
    for img in soup.select(".gallery-slide .img-view"):
        src = img.get("data-src", "")
        if src:
            if not src.startswith("http"):
                src = BASE_URL + src
            gallery_images.append(src)
    if gallery_images:
        product["allImages"] = gallery_images

    # Brand from page if not in JSON-LD
    if not product.get("brand"):
        for el in soup.select("a"):
            href = el.get("href", "")
            if "/brand/" in href or "/thuong-hieu/" in href:
                product["brand"] = el.get_text(strip=True)
                break

    if not product.get("name") or not product.get("price"):
        return None

    return product


def generate_sql(products):
    lines = []
    lines.append("-- =============================================")
    lines.append("-- DATA SCRAPED FROM mayanh24h.com")
    lines.append("-- For learning purposes only")
    lines.append("-- =============================================")
    lines.append("")
    lines.append("SET IDENTITY_INSERT [Products] ON;")
    lines.append("")

    for i, p in enumerate(products):
        product_id = i + 1
        name = p.get("name", "").replace("'", "''")
        desc = p.get("description", "").replace("'", "''")
        price = p.get("price", 0)
        stock = 10
        img = p.get("localImage", "") or ""
        cat_id = p.get("categoryId", 1)

        desc_clean = re.sub(r"<[^>]+>", " ", desc).strip()
        desc_clean = re.sub(r"\s+", " ", desc_clean)[:500]

        lines.append(f"INSERT INTO [Products] ([Id], [Name], [Description], [Price], [StockQuantity], [ImageUrl], [CategoryProductId])")
        lines.append(f"VALUES ({product_id}, N'{name}', N'{desc_clean}', {price}.00, {stock}, N'{img}', {cat_id});")
        lines.append("")

    lines.append("SET IDENTITY_INSERT [Products] OFF;")
    return "\n".join(lines)


def main():
    print("=" * 60)
    print("SCRAPER: mayanh24h.com -> Camera24h.Shop Database")
    print(f"Products per category: {PRODUCTS_PER_CATEGORY}")
    print(f"Delay: {DELAY}s")
    print("=" * 60)

    all_products = []

    for cat in CATEGORIES:
        print(f"\n[CAT] {cat['name']} (ID={cat['id']})")
        print(f"  URL: {BASE_URL}{cat['url']}")

        product_urls = get_product_urls(BASE_URL + cat["url"], PRODUCTS_PER_CATEGORY)
        print(f"  Found {len(product_urls)} product URLs")

        cat_dir = os.path.join(IMAGES_DIR, cat["slug"])
        os.makedirs(cat_dir, exist_ok=True)

        for i, purl in enumerate(product_urls):
            print(f"  [{i+1}/{len(product_urls)}] {purl}")

            product = scrape_product_detail(purl, cat["slug"], cat["id"])
            if not product:
                print(f"    [SKIP] Could not parse product")
                time.sleep(DELAY)
                continue

            # Download main image
            if product.get("imageUrl"):
                img_url = product["imageUrl"]
                safe_name = re.sub(r"[^a-zA-Z0-9_-]", "_", product["name"])[:50]
                filename = f"{cat['slug']}_{i+1}_{safe_name}"
                local_path = download_image(img_url, cat_dir, filename)
                if local_path:
                    product["localImage"] = local_path
                    print(f"    Image: OK")
                else:
                    product["localImage"] = ""
                    print(f"    Image: FAILED")
            else:
                product["localImage"] = ""

            all_products.append(product)
            time.sleep(DELAY)

        print(f"  Done: {len([p for p in all_products if p['categoryId'] == cat['id']])} products scraped")

    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, "scraped_products.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_products, f, ensure_ascii=False, indent=2)
    print(f"\n[OUTPUT] JSON: {json_path} ({len(all_products)} products)")

    # Save SQL
    sql_path = os.path.join(OUTPUT_DIR, "import_products.sql")
    sql_content = generate_sql(all_products)
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"[OUTPUT] SQL: {sql_path}")

    print("\n" + "=" * 60)
    print(f"COMPLETE: {len(all_products)} products scraped")
    print("=" * 60)


if __name__ == "__main__":
    main()
