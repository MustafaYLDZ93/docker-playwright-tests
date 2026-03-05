import { test } from '@playwright/test';


test('GET İsteği ve Kullanıcı Bulma @get-request', async ({ request }) => {

    console.log("🚀 Kullanıcı listesi çekiliyor...");

    // 1. GET İsteği Gönder (Veri okuma)
    const response = await request.get('https://jsonplaceholder.typicode.com/users');

    // 2. Durum Kodu Kontrolü (200 OK olmalı)
    if (response.status() === 200) {
        console.log("✅ Sunucu listeyi gönderdi (200 OK).");
    } else {
        throw new Error("❌ Liste çekilemedi!");
    }

    // 3. Veriyi JSON'a çevir (Bize bir LİSTE dönecek)
    const users = await response.json();

    // Küçük bir kontrol: Kaç kullanıcı geldi?
    console.log(`Toplam Kullanıcı Sayısı: ${users.length}`);

    // 4. HEDEFİ BUL (.find metodu)
    // "Bana kullanıcı adı 'Antonette' olanı bul getir" diyoruz.
    const hedefUser = users.find(user => user.username === 'Antonette');

    // 5. Doğrulama
    if (hedefUser) {
        console.log("🎯 Kullanıcı bulundu!");
        console.log(`İsim: ${hedefUser.name}`);
        console.log(`Email: ${hedefUser.email}`);

        // Email kontrolü
        if (hedefUser.email === "Shanna@melissa.tv") {
            console.log("✅ Email adresi doğru!");
        } else {
            throw new Error("❌ Email adresi yanlış!");
        }

    } else {
        throw new Error("❌ 'Antonette' isminde biri bulunamadı!");
    }
});