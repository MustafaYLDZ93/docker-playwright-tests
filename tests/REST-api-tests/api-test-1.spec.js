import { test } from '@playwright/test';

test('JSONPlaceholder ile POST Testi', async ({ request }) => {
    
    // 1. Veri Hazırlama (Javascript Objesi)
    const yeniGonderi = {
        title: 'Playwright Öğreniyorum',
        body: 'API testleri aslında çok zevkliymiş.',
        userId: 1
    };

    console.log("🚀 İstek gönderiliyor...");

    // 2. İstek Gönderme (Header, User-Agent vs. GEREK YOK)
    // JSONPlaceholder her türlü isteği kabul eder.
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: yeniGonderi
    });

    // 3. Durum Kodunu Kontrol Et
    console.log(`Status Code: ${response.status()}`);
    
    // Eğer 201 (Created) ise her şey yolunda demektir
    if (response.status() === 201) {
        console.log("✅ Sunucu veriyi kabul etti (201 Created).");
    } else {
        throw new Error("❌ Beklenmedik durum kodu!");
    }

    // 4. Cevabı Okuma (Parse Etme)
    const responseBody = await response.json();
    console.log("📥 Gelen Cevap:", responseBody);

    // 5. Destructuring ile Veriyi Çekme
    // Gelen cevapta 'id' otomatik oluşturulur.
    const { title, id } = responseBody;

    // 6. Doğrulama (Assertion)
    if (title === "Playwright Öğreniyorum") {
        console.log(`✅ Test Başarılı! Yeni ID: ${id}`);
        console.log("🎉 Tebrikler! İlk API testin başarıyla geçti.");
    }
});