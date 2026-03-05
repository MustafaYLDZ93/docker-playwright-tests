import { test, expect } from '@playwright/test';
import { z } from 'zod'; // Zod kütüphanesini içeri alıyoruz

test('Zod ile Detaylı Kullanıcı Şema Doğrulaması @zod-schema-definition', async ({ request }) => {

    // =================================================================
    // 1. ADIM: MİMARİYİ OLUŞTURMA (Schema Definition)
    // =================================================================
    // Karmaşık objeleri parçalara bölerek yönetmek en iyi pratiktir.

    // A) Önce en içteki "Geo" (Konum) objesini tanımlayalım
    const GeoSchema = z.object({
        lat: z.string(), // API'den string olarak geliyor ("-37.3159")
        lng: z.string()
    });

    // B) "Address" objesini tanımlayalım (Geo'yu içine gömeceğiz)
    const AddressSchema = z.object({
        street: z.string().min(1, "Sokak ismi boş olamaz"), // En az 1 karakter
        suite: z.string(),
        city: z.string(),
        zipcode: z.string().regex(/[\d-]/, "Zipcode rakam veya tire içermeli"), // Regex kontrolü
        geo: GeoSchema // Yukarıda tanımladığımız şemayı buraya çağırdık
    });

    // C) "Company" (Şirket) objesi
    const CompanySchema = z.object({
        name: z.string(),
        catchPhrase: z.string(),
        bs: z.string() // Business Slogan
    });

    // D) ANA KULLANICI ŞEMASI (Hepsini Birleştiriyoruz)
    const UserSchema = z.object({
        id: z.number().positive(), // ID kesinlikle pozitif sayı olmalı
        name: z.string(),
        username: z.string(),

        // Zod'un en sevilen özelliği: Hazır format kontrolleri
        email: z.string().email({ message: "Geçersiz Email Formatı!" }),

        // İç içe objeleri buraya bağlıyoruz
        address: AddressSchema,

        // Telefon bazen "1-770..." bazen "(254)..." geliyor. 
        // En az 5 karakter olsun diyoruz.
        phone: z.string().min(5),

        website: z.string(),

        company: CompanySchema
    });

    // =================================================================
    // 2. ADIM: İSTEĞİ ATMA VE VERİYİ ALMA
    // =================================================================
    console.log("🌍 Kullanıcı listesi çekiliyor...");
    const response = await request.get('https://jsonplaceholder.typicode.com/users');

    expect(response.status()).toBe(200);

    const users = await response.json(); // Bu bir Dizi (Array) döner


    // =================================================================
    // 3. ADIM: DOĞRULAMA (VALIDATION)
    // =================================================================
    console.log("🛡️ Zod ile veriler denetleniyor...");

    // API bize tek bir kullanıcı değil, kullanıcı LİSTESİ dönüyor.
    // O yüzden şemayı z.array() içine alıyoruz.
    const UserListSchema = z.array(UserSchema);

    // .safeParse() kullanıyoruz. Bu metod testi hemen patlatmaz, 
    // bize başarılı/başarısız bilgisini verir. Böylece hatayı ekrana basabiliriz.
    const sonuc = UserListSchema.safeParse(users);

    if (!sonuc.success) {
        console.error("❌ ŞEMA HATASI BULUNDU!");
        // Hatanın tam olarak nerede olduğunu gösterir
        console.error(JSON.stringify(sonuc.error.format(), null, 2));

        // Testi şimdi patlatıyoruz
        throw new Error("Gelen veri Zod şemasına uymuyor!");
    }

    console.log(`✅ Başarılı! ${users.length} kullanıcının hepsi kurallara uyuyor.`);
});