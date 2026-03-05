import { test } from '@playwright/test';
test('Zincirleme Test: Kullanıcıdan Postlara Git', async ({ request }) => {

    console.log("--- 1. ADIM: Kullanıcıyı Bul ---");
    
    // Tüm kullanıcıları çekiyoruz
    const userResponse = await request.get('https://jsonplaceholder.typicode.com/users');
    const users = await userResponse.json();

    // 'Ervin Howell' isimli kullanıcıyı buluyoruz (.find metodu)
    const hedefKisi = users.find(u => u.name === 'Ervin Howell');

    if (!hedefKisi) {
        throw new Error("Kullanıcı bulunamadı!");
    }

    console.log(`✅ Hedef Kişi Bulundu: ${hedefKisi.name}`);

    // --- KRİTİK NOKTA: Veriyi Taşıma ---
    // Kullanıcının ID'sini (2) alıp bir değişkene atıyoruz.
    const userId = hedefKisi.id;
    console.log(`🆔 Alınan ID: ${userId}`);


    console.log("\n--- 2. ADIM: O Kullanıcının Yazılarını Çek ---");

    // ZİNCİRLEME İŞLEMİ BURADA!
    // Yukarıda bulduğumuz 'userId' değişkenini, aşağıdaki URL'in içine gömüyoruz.
    // Backtick (`) ve ${} kullandığımıza dikkat et.
    const postResponse = await request.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    
    // Gelen postları okuyoruz
    const posts = await postResponse.json();

    // --- 3. ADIM: Doğrulama ---
    console.log(`📝 Bu kullanıcıya ait toplam ${posts.length} yazı bulundu.`);

    // Gerçekten doğru kişinin yazıları mı geldi? Kontrol edelim.
    // Gelen ilk yazının userId'si, bizim aradığımız userId ile aynı mı?
    if (posts[0].userId === userId) {
        console.log("✅ Test Başarılı: Gelen yazılar doğru kişiye ait!");
    } else {
        throw new Error("❌ Hata: Başka birinin yazıları geldi!");
    }
});