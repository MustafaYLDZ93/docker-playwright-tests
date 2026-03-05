import { test, expect } from '@playwright/test';

test('Token Alma ve Yetkili İşlem Yapma @token-api-test', async ({ request }) => {

    // ADIM 1: LOGIN OLUP TOKEN ALMA
    console.log("🔐 Giriş yapılıyor...");

    const loginResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
        data: {
            username: 'admin',      // Bu API'nin standart şifresi
            password: 'password123'
        }
    });

    // Giriş başarılı mı?
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    const myToken = loginBody.token; // Token'ı değişkene attık

    console.log(`🔑 Alınan Token: ${myToken}`);

    // Eğer token gelmediyse testi durdur
    expect(myToken).toBeTruthy();

    // ========================================================
    // ADIM 2: TOKEN İLE GÜNCELLEME YAPMA (PUT)
    /* Not: Restful-booker API'si token'ı 'Cookie' olarak ister.
       Çoğu modern API ise 'Authorization: Bearer <token>' kullanır.
       Aşağıda 'headers' kısmına dikkat et.
    */
    // Rastgele bir rezervasyon ID'si
    const bookingId = 2;

    console.log("🛠️ Rezervasyon güncelleniyor...");

    const updateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
        // İŞTE KRİTİK NOKTA BURASI: HEADERS
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${myToken}` // Token'ı buraya gömüyoruz 
        },
        data: {
            firstname: "Playwright",
            lastname: "Tester",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2024-01-01",
                checkout: "2024-01-02"
            },
            additionalneeds: "Breakfast"
        }
    });

    // Token doğruysa 200 döner, değilse 403 Forbidden döner.
    console.log(`Status Code: ${updateResponse.status()}`);
    expect(updateResponse.status()).toBe(200);

    const updatedData = await updateResponse.json();
    console.log("✅ Güncellenen Veri:", updatedData);
    expect(updatedData.firstname).toBe("Playwright");
});


/* bearer token kullanımı için genel örnek:
headers: {
    'Authorization': `Bearer ${myToken}`, // Standart yöntem budur
    'Content-Type': 'application/json'
}

bu örnkekte restful-booker API'si cookie ile token beklediği için yukarıdaki gibi kullandık.
*/