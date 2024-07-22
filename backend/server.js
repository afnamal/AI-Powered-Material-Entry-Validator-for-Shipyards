const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // dotenv'i yükleyin

// CORS desteği
app.use(cors());
app.use(express.json()); // JSON verileri için body parser

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// JSON verilerini okuyun
let malzemeler = JSON.parse(fs.readFileSync('malzemeler.json'));

// Öneri API'si
app.get('/suggest', (req, res) => {
  const queryParams = req.query;
  const combinedQuery = Object.values(queryParams).filter(Boolean).join(' ').toUpperCase();

  const suggestions = malzemeler.filter(item => 
    item.DESCRIPTION && item.DESCRIPTION.includes(combinedQuery)
  );

  res.json(suggestions);
});

// POST API'si
app.post('/submit', (req, res) => {
  const newMalzeme = req.body;

  // Malzeme var mı kontrolü
  const isDuplicate = malzemeler.some(item =>
    normalizeString(item.materialName) === normalizeString(newMalzeme.materialName) &&
    normalizeString(item.category) === normalizeString(newMalzeme.category) &&
    normalizeString(item.material) === normalizeString(newMalzeme.material) &&
    normalizeString(item.type) === normalizeString(newMalzeme.type) &&
    normalizeString(item.standard) === normalizeString(newMalzeme.standard) &&
    normalizeString(item.nominalDiameter) === normalizeString(newMalzeme.nominalDiameter) &&
    normalizeString(item.inchSize) === normalizeString(newMalzeme.inchSize) &&
    normalizeString(item.schedule) === normalizeString(newMalzeme.schedule) &&
    normalizeString(item.outerDiameter) === normalizeString(newMalzeme.outerDiameter) &&
    normalizeString(item.wallThickness) === normalizeString(newMalzeme.wallThickness) &&
    normalizeString(item.materialQuality) === normalizeString(newMalzeme.materialQuality) &&
    normalizeString(item.additionalInfo) === normalizeString(newMalzeme.additionalInfo) &&
    normalizeString(item.alloy) === normalizeString(newMalzeme.alloy) &&
    normalizeString(item.dimensions) === normalizeString(newMalzeme.dimensions)
  );

  if (isDuplicate) {
    return res.status(409).json({ message: 'Bu malzeme zaten malzeme listesinde var.' });
  }

  // Malzeme ekle
  malzemeler.push(newMalzeme);
  fs.writeFileSync('malzemeler.json', JSON.stringify(malzemeler, null, 2));
  res.status(201).json(newMalzeme);

  // Konsolda gönderilen veriyi yazdır
  console.log('Gönderilen Malzeme:', newMalzeme);
});

const normalizeString = (str) => {
  if (!str) return '';
  const letters = { 'i': 'İ', 'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç', 'ı': 'I' };
  str = str.replace(/(([iışğüçö]))/g, letter => letters[letter]);
  return str.toUpperCase().trim();
};

// OpenAI API Proxy
app.post('/ask-ai', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const postData = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Sen malzeme bilgileriyle ilgili yardımcı olan bir asistansın. Tersanede malzeme kayıtlarının doğru girilip girilmediğini kontrol ediyorsun. Kayıtlarda kategori, tip ve malzeme bilgisi sırasıyla ve eksiksiz girilmeli. Ardından diğer ölçüler, standartlar ve gerekli bilgiler gelmeli. Gereksiz bilgi olmamalı. Örneğin: BORU DİKİŞSİZ ÇELİK EN10216-1 DN40 (OD:48,3 mm x 11 mm) ST37 *3.1 geçerli bir kayıttır. SAC ALUMİNYUM 5 x 1500 x 3000 geçerli değildir çünkü tip belirtmeden malzeme belirtilmiştir. Kaydın geçerli olup olmadığını "doğru" veya "yanlış" olarak yanıtlayacaksın ve neden doğru veya yanlış olduğunu kısaca belirteceksin.' },
      {
        role: 'user',
        content: `Materyal kaydı: ${prompt}. Bu kayıt geçerli mi?`
      },
    ]
    
  };
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', postData, config);
    res.json(response.data.choices[0].message.content.trim());
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    res.status(500).json('Yapay Zeka ile iletişim kurarken bir hata oluştu.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
