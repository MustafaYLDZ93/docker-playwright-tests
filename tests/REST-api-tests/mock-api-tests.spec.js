import { test, expect } from '@playwright/test';

test('Mock 1: Gerçek veriyi sahte veriyle değiştirme', async ({ page }) => {
    
    // 1. AĞ TRAFİĞİNİ DİNLE VE YAKALA
    // URL içinde '/users/1' geçen herhangi bir isteği yakala
    await page.route('**/users/1', async route => {
        
        console.log("🚀 İstek havada yakalandı! Sahte cevap veriliyor...");
        
        // 2. SAHTE CEVABI GÖNDER (Fulfill)
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 1,
                name: "SÜPER TESTÇİ", // Gerçekte "Leanne Graham" ama biz bunu yolluyoruz
                username: "MockUser",
                email: "test@mock.com"
            })
        });
    });

    // 3. SAYFAYA GİT (Browser bu adrese gittiğinde yukarıdaki tuzağa düşecek)
    // Not: JSONPlaceholder'ın demo sayfasını veya API'yi doğrudan çağırabiliriz.
    // Görmen için direkt API adresine gidiyorum:
    await page.goto('https://jsonplaceholder.typicode.com/users/1');

    // 4. KONTROL ET
    // Ekranda gerçek isim değil, bizim sahte ismimiz yazmalı
    const icerik = await page.textContent('body');
    console.log("Ekranda Görünen:", icerik);

    expect(icerik).toContain("SÜPER TESTÇİ");
});


test('Mock 2: Sunucu Hatası Simülasyonu (500 Hatası)', async ({ page }) => {
    // 1. Önce boş bir sayfaya gitmemiz lazım ki tarayıcı bağlamı oluşsun
    await page.goto('https://jsonplaceholder.typicode.com/');

    // 2. TUZAK KURULUYOR: '/posts' adresine giden istekleri yakala ve 500 dön
    await page.route('**/posts', async route => {
        console.log("🛑 İstek yakalandı, sahte 500 hatası dönülüyor...");
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: "Sunucu patladı!" })
        });
    });

    // 3. İSTEK GÖNDERME (KRİTİK NOKTA BURASI)
    // page.request.post KULLANMIYORUZ!
    // Onun yerine tarayıcının içinde (Frontend tarafında) fetch çalıştırıyoruz.
    
    const status = await page.evaluate(async () => {
        // Bu kod tarayıcının içinde (Console'da yazılmış gibi) çalışır
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({ title: 'Test' })
        });
        return response.status;
    });

    // 4. KONTROL
    console.log(`Dönen Status Code: ${status}`);
    expect(status).toBe(500);
});

test('Mock 3: Gereksiz Resimleri Engelleme (Hızlandırma)', async ({ page }) => {

    // Sonu .png, .jpg veya .jpeg ile biten her şeyi yakala ve İPTAL ET
    await page.route('**/*.{png,jpg,jpeg}', route => {
        console.log(`⛔ Resim engellendi: ${route.request().url()}`);
        route.abort(); // İsteği öldür, sunucuya gitmesin
    });

    // Resimlerle dolu bir siteye gidelim
    await page.goto('https://www.amazon.com.tr'); // Örnek olarak

    // Sayfa resimler yüklenmediği için çok daha hızlı açılacaktır.
    console.log("Sayfa resimsiz olarak yüklendi.");
});