import { test, expect } from '@playwright/test';

test('GET - Kullanıcıdan Veri Çekme', async ({ request }) => {
    // 1. İsteği gönder (endpoint: /posts/1)
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    // 2. Durum kodunu kontrol et (200 OK olmalı)
    expect(response.status()).toBe(200);

    // 3. Gelen veriyi JSON'a çevir
    const body = await response.json();
    console.log("GET Cevabı:", body);

    // 4. İçeriği doğrula
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    // Başlığın boş olmadığını kontrol edelim
    expect(body.title).toBeTruthy();
    console.log(response.status())
});

test('POST - Yeni Kayıt Oluşturma', async ({ request }) => {
    // Gönderilecek veri
    const yeniVeri = {
        title: 'Playwright ile API Testi',
        body: 'Bu post isteği ile oluşturuldu.',
        userId: 101
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: yeniVeri
    });

    // POST işlemi başarılıysa genelde 201 (Created) döner
    expect(response.status()).toBe(201);

    const body = await response.json();
    console.log("POST Cevabı:", body);

    // Sunucunun bize bir ID atadığını kontrol edelim
    expect(body.id).toBe(101); // JSONPlaceholder hep 101 döner
    expect(body.title).toBe('Playwright ile API Testi');
    console.log(response.status());

});

test.skip('PUT - Mevcut Kaydı Güncelleme', async ({ request }) => {

    // Önce mevcut veriyi çekelim
    const response1 = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response1.status()).toBe(200);
    const mevcutVeri = await response1.json();
    console.log("Güncelleme Öncesi Veri:", mevcutVeri);

    const guncelVeri = {
        id: 1, // Hangi ID'yi güncelliyorsak onu da belirtmek iyi pratiktir
        title: 'Güncellenmiş Başlık',
        body: 'İçerik tamamen değişti.',
        userId: 1
    };

    // Dikkat: URL'in sonunda '/1' var. 1 numaralı kaydı değiştiriyoruz.
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
        data: guncelVeri
    });

    // Güncelleme başarılıysa 200 döner
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log("PUT Cevabı:", body);

    expect(body.title).toBe('Güncellenmiş Başlık');
    console.log(response.status())
});

test.skip('DELETE - Kayıt Silme', async ({ request }) => {
    // 1 numaralı postu siliyoruz
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

    // Başarılı silme işlemi genelde 200 veya 204 (No Content) döner
    // JSONPlaceholder 200 dönüyor.
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log("DELETE Cevabı:", body);
    // JSONPlaceholder silinen veri için boş obje {} döner.

    console.log(response.status() === 200 ? "✅ Kayıt başarıyla silindi." : "❌ Kayıt silme başarısız.");
    console.log(response.status());
});