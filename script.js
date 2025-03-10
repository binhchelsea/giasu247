document.getElementById('imageForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const line1 = document.getElementById('line1').value.trim();
  const line2 = document.getElementById('line2').value.trim();
  const line3 = document.getElementById('line3').value.trim();
  const subImageInput = document.getElementById('subImage');

  if (!subImageInput.files[0]) {
    alert("Vui lòng chọn ảnh phụ.");
    return;
  }

  const backgroundImg = new Image();
  backgroundImg.src = 'background.png';

  backgroundImg.onload = function () {
    const canvas = document.getElementById('resultCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = backgroundImg.width;
    canvas.height = backgroundImg.height;

    const subImageFile = subImageInput.files[0];
    const subImageURL = URL.createObjectURL(subImageFile);
    const subImg = new Image();
    subImg.src = subImageURL;

    subImg.onload = function () {
      // 🟡 CROP ẢNH PHỤ VỀ TỶ LỆ 1:1 (HÌNH VUÔNG)
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');

      const side = Math.min(subImg.width, subImg.height);
      const startX = (subImg.width - side) / 2;
      const startY = (subImg.height - side) / 2;

      cropCanvas.width = side;
      cropCanvas.height = side;

      cropCtx.drawImage(subImg, startX, startY, side, side, 0, 0, side, side);

      const croppedImg = new Image();
      croppedImg.src = cropCanvas.toDataURL();

      croppedImg.onload = function () {
        // 🖼️ VẼ ẢNH PHỤ (CROPPED + RESIZE)
        const subX = 960;
        const subY = 150;
        const subW = 900;
        const subH = 900;

        ctx.drawImage(croppedImg, subX, subY, subW, subH);

        // 🖼️ VẼ ẢNH CHÍNH ĐÈ LÊN
        ctx.drawImage(backgroundImg, 0, 0);

        // ✏️ VIẾT CHỮ
        const leftMargin = 80;
        const maxWidth = 800;

        ctx.fillStyle = "#dca328";
        ctx.textBaseline = "top";

        // 🔸 Dòng 1: 50pt - bold
        ctx.font = "bold 50pt Arial";
        const top1 = 300;
        ctx.fillText(line1, leftMargin, top1, maxWidth);

        // 🔸 Dòng 2: 35pt - italic
        ctx.font = "italic 35pt Arial";
        const top2 = top1 + 90;
        ctx.fillText(line2, leftMargin, top2, maxWidth);

        // 🔸 Dòng 3: 40pt - regular
        ctx.font = "40pt Arial";
        const top3 = top2 + 100;
        drawWrappedText(ctx, line3, leftMargin, top3, maxWidth, 60);

        const link = document.getElementById('downloadLink');
        link.href = canvas.toDataURL("image/png");
      };
    };
  };
});

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  paragraphs.forEach(paragraph => {
    const words = paragraph.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    y += lineHeight;
  });
}
