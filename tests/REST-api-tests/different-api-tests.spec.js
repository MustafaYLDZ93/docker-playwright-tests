import { test, expect } from '@playwright/test';


test('Güvenlik Testi: Tokensız Erişim (401 Beklenir)', async ({ request }) => {
    // Restful-booker PUT işlemi token ister. Token göndermiyoruz.
    const response = await request.put('https://restful-booker.herokuapp.com/booking/1', {
        data: {
            firstname: "Hacker",
            lastname: "Test"
        }
    });

    // Kesinlikle 403 (Forbidden) veya 401 (Unauthorized) dönmeli
    console.log("Status:", response.status());
    console.log("Cevap:", await response.text());
    expect(response.status()).toBe(403); 
});

test('Fonksiyonel Test: Query Parametreleri ile Filtreleme', async ({ request }) => {
    // Sadece userId=1 olan postları getir diyoruz
    // URL Şuna dönüşür: .../posts?userId=1
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
        params: {
            userId: 1
        }
    });

    expect(response.status()).toBe(200);
    const postlar = await response.json();

    // Gelen dizideki HER BİR elemanın userId'si 1 mi?
    postlar.forEach(post => {
        expect(post.userId).toBe(1);
    });
    console.log(`✅ ${postlar.length} adet kayıt geldi ve hepsi User 1'e ait.`);
});

test('Performans Testi: Cevap Süresi Kontrolü @performance-test', async ({ request }) => {
    const baslangic = Date.now(); // Kronometreyi başlat
    
    const response = await request.get('https://jsonplaceholder.typicode.com/photos');
    
    const bitis = Date.now(); // Kronometreyi durdur
    const sure = bitis - baslangic; // Farkı bul (milisaniye)

    console.log(`⏱️ API Cevap Süresi: ${sure} ms`);

    expect(response.status()).toBe(200);
    
    // Cevap 2000 ms (2 saniye) altında olmalı
    expect(sure).toBeLessThan(2000); 
});


test('Schema Validation - Basit Yöntem', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Veri: { userId: 1, id: 1, title: "...", body: "..." }
    
    // Değerin ne olduğu önemli değil, TÜRÜ önemli:
    expect(data).toEqual(expect.objectContaining({
        userId: expect.any(Number), // Sayı olmak ZORUNDA
        id: expect.any(Number),     // Sayı olmak ZORUNDA
        title: expect.any(String),  // Metin olmak ZORUNDA
        body: expect.any(String)    // Metin olmak ZORUNDA
    }));

    console.log("✅ Veri tipleri doğrulandı (String/Number kontrolü).");
});

test('İç İçe (Nested) Obje Doğrulaması', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await response.json();

    // Senaryo: user -> address -> geo yapısını kontrol etmek
    expect(user).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        
        // 1. Katman: Adres Objesi
        address: expect.objectContaining({
            street: expect.any(String),
            city: expect.any(String),
            zipcode: expect.any(String),
            
            // 2. Katman: Geo Objesi (Enlem/Boylam)
            geo: expect.objectContaining({
                lat: expect.any(String), // API string dönüyor ("-37.3159")
                lng: expect.any(String)
            })
        })
    }));
    console.log("✅ İç içe katmanlı yapı doğrulandı.");
});