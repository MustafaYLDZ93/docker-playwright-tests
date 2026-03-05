import { test } from '@playwright/test';


test('Hatalı Debug Testi: Kayıp Yorum', async ({ request }) => {
    
    console.log("🚀 Test Başlıyor...");

    // 1. Tüm yorumları çekiyoruz
    const response = await request.get('https://jsonplaceholder.typicode.com/comments');
    const tumYorumlar = await response.json();

    console.log(`Toplam Yorum Sayısı: ${tumYorumlar.length}`);

    // 2. HEDEF: Bu mail adresini arıyoruz
    // (Burası şüpheli görünüyor, bakalım bulabilecek mi?)
    const arananMail = "Nikita@garfield.biz"; 

    // 3. Listede arama yapıyoruz
    const bulunanYorum = tumYorumlar.find(yorum => yorum.email === arananMail);

    // 4. Sonucu ekrana basmaya çalışıyoruz
    // HATA BURADA ÇIKACAK! Çünkü 'bulunanYorum' muhtemelen boş.
    console.log(`✅ Bulunan Yorum ID'si: ${bulunanYorum.id}`); 
    console.log("🎉 Test Başarıyla Tamamlandı.");
});