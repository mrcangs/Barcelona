# Barselona 2026 · Ortak Planlayıcı

11–16 Kasım 2026 Barselona seyahati için 6 kişilik ekibin telefondan aynı anda kullandığı canlı plan sayfası.
Statik site (build yok) + Firebase Realtime Database.

## Özellikler
- **Plan**: 6 gün × 4 slot (Sabah · Öğle & Demir uykusu · İkindi · Akşam) dikey zaman çizelgesi. Sabit kartlar (uçuşlar, transfer, HYROX), rehberden gelen **öneri** kartları (tek dokunuşla eklenir), "Şimdi" vurgusu.
- **Havuz**: rehberdeki tüm mekanlar + ekibin eklediği öneriler. Arama, kategori filtresi, rezervasyon rozeti. Masaüstünde sürükle-bırak.
- **Kart detayı**: 👍/👎 oy (kim ne verdi), "Kim gidiyor?" (Grup A/B/C), Kesinleştir, Taşı, Kaldır, Haritada aç.
- **Kararlar**: HYROX Relay / Doubles (kazanan takvime işlenir), Cumartesi büyük akşam.
- **Hazırlık listesi**: bilet ve rezervasyonlar, kimin işaretlediği görünür.
- **Sohbet**: canlı, okunmamış rozeti.
- **Özet**: tüm günler tek ekranda.

## Erişim modeli
- Veri `trips/<davet-anahtarı>/` altında. Anahtar yalnızca davet linkinde (`…/#t=<anahtar>`) bulunur, repoda yoktur.
- Linke ilk tıklayan **"Sen kimsin?"** ekranını görür; seçim o cihazda kalıcıdır, arayüzden değiştirilemez.
  (Tarayıcı verisi silinirse tekrar sorulur.)
- Firebase kuralları kök okumayı kapatır; sadece doğru anahtarın altı okunup yazılabilir.

## Kurulum

### 1) Firebase kuralları
1. [Firebase Console](https://console.firebase.google.com/project/barcelona-11-16nov/database/barcelona-11-16nov-default-rtdb/rules) → Realtime Database → **Rules**
2. Lokal `database.rules.local.json` dosyasının içeriğini (anahtar zaten yerleştirilmiş) yapıştır → **Publish**.
   Bu dosya `.gitignore`'dadır; repoda sadece `__TRIP_KEY__` yer tutuculu şablon (`database.rules.json`) bulunur.

> Test mode kuralları ~30 gün sonra kendiliğinden kapanır. Bu adım yapılmazsa site seyahat ortasında çalışmayı durdurabilir.

### 2) GitHub Pages
1. GitHub'da public repo oluştur (ör. `barcelona-2026`), bu klasörü push'la.
2. Repo → Settings → Pages → Source: **Deploy from a branch**, Branch: `main` / `(root)`.
3. Birkaç dakika sonra: `https://<kullanıcı>.github.io/barcelona-2026/`

### 3) Davet linki
`https://<kullanıcı>.github.io/barcelona-2026/#t=<.trip-key içeriği>` → WhatsApp grubunda paylaş.
Sayfadaki **Davet linki** butonu da aynı linki kopyalar.

### 4) (Önerilen) API key kısıtı
Google Cloud Console → APIs & Services → Credentials → Firebase web key → HTTP referrers:
`https://<kullanıcı>.github.io/*`, `http://localhost:*/*`.
Firebase web config'inin repoda görünmesi normaldir; güvenlik kurallar ve gizli anahtarla sağlanır.

## Otomatik commit
`scripts/auto-commit.ps1` değişiklik varsa `git add -A` + commit + `origin`'e push yapar; staged diff'te davet anahtarı görürse commit'i iptal eder. Log: `.auto-commit.log`.

Claude Code her yanıt sonunda çalıştırsın diye `.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe",
            "args": ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "scripts/auto-commit.ps1"],
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```
Elle: `powershell -ExecutionPolicy Bypass -File scripts/auto-commit.ps1`

## İçerik düzenleme
Tüm sabit içerik `js/data.js` içinde: `POOL` (mekanlar), `SUGGESTED_PLAN` (öneriler), `FIXED_EVENTS` (uçuşlar vb.), `DECISIONS`, `CHECKLIST`, `PRACTICAL`.
Yeni kişi eklenirse `PEOPLE` ile birlikte `database.rules.json` içindeki isim listesini de güncelle.

## Lokal çalıştırma
Herhangi bir statik sunucu: `npx serve .` veya `python -m http.server 8000` → `http://localhost:8000/#t=<anahtar>`
