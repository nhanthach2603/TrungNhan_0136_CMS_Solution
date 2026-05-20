using CMS.Data.Context; // 1. Thêm namespace chứa ApplicationDbContext
using Microsoft.EntityFrameworkCore; // 2. Thêm namespace của EF Core

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// ============================================================================
// ĐOẠN CODE BỔ SUNG: Đăng ký kết nối Database (Bắt buộc phải nằm TRƯỚC builder.Build())
// ============================================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
// ============================================================================

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();