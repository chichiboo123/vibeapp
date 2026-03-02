/**
 * 치수쌤 바이브코딩 쇼룸 — Google Apps Script
 *
 * 스프레드시트의 모든 컬럼을 JSON으로 반환합니다.
 * 지원 컬럼: 분류 / 이름 / 영문명 / 소개 / 기능 / 키워드 / 해시태그 /
 *            개발년도 / URL / Key Features / Functions / Keywords / Hashtags
 *
 * [배포 방법]
 * 1. Google Apps Script 편집기에서 이 코드를 붙여넣기
 * 2. 배포 > 웹 앱으로 배포
 * 3. 실행 대상: "나"  |  액세스 권한: "모든 사용자"
 * 4. 생성된 URL을 index.html의 SHEET_API_URL에 입력
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data  = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse([]);
    }

    // 첫 번째 행 = 헤더 (컬럼명)
    const headers = data[0].map(h => String(h).trim());

    const rows = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // 완전히 빈 행은 건너뜀
      if (row.every(cell => cell === '' || cell === null || cell === undefined)) {
        continue;
      }

      const obj = {};
      headers.forEach((header, j) => {
        // 빈 헤더는 무시
        if (!header) return;
        const val = row[j];
        obj[header] = (val !== null && val !== undefined) ? String(val).trim() : '';
      });

      rows.push(obj);
    }

    return jsonResponse(rows);

  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
