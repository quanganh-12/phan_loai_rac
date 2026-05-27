const correctAnswers = {
  "fami.jpg": "organic",
  "pallet_go.jpg": "recycle",
  "vo_hoa_qua.jpg": "organic",
  "ac_quy.jpg": "hazard",
  "pallet_nhua.jpg": "recycle",
  "thuc_an.jpg": "organic",
  "son.jpg": "hazard",
  "chai_nhua.jpg": "recycle",
  "rac_hoa_chat.jpg": "hazard",
  "nilon.jpg": "recycle",
  "hop_xop.jpg": "organic",
  "pin.jpg": "hazard"
};

// =====================
// ✅ DESKTOP DRAG
// =====================
let draggedItem = null;

document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('dragstart', function () {
    draggedItem = this;
  });
});

document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('dragover', e => e.preventDefault());

  box.addEventListener('drop', function () {
    this.appendChild(draggedItem);
    resetStyle(draggedItem);
    checkAllPlaced();
  });
});

// =====================
// ✅ MOBILE DRAG (mượt + chống bấm nhầm)
// =====================
let touchItem = null;
let originalParent = null;

let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

const DRAG_THRESHOLD = 10; // di chuyển tối thiểu
const HOLD_DELAY = 150;   // giữ 150ms mới kéo

document.querySelectorAll('.item').forEach(item => {

  let holdTimer = null;

  item.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;

    holdTimer = setTimeout(() => {
      touchItem = this;
      originalParent = this.parentElement;
      isDragging = true;

      const rect = this.getBoundingClientRect();

      offsetX = startX - rect.left;
      offsetY = startY - rect.top;

      this.style.position = "fixed";
      this.style.left = rect.left + "px";
      this.style.top = rect.top + "px";
      this.style.width = rect.width + "px";
      this.style.zIndex = "1000";

      this.classList.add("dragging");

    }, HOLD_DELAY);
  });

  item.addEventListener('touchmove', function (e) {
    const touch = e.touches[0];

    if (!isDragging) {
      if (
        Math.abs(touch.clientX - startX) > DRAG_THRESHOLD ||
        Math.abs(touch.clientY - startY) > DRAG_THRESHOLD
      ) {
        clearTimeout(holdTimer);
      }
      return;
    }

    e.preventDefault();

    this.style.left = touch.clientX - offsetX + "px";
    this.style.top = touch.clientY - offsetY + "px";
  });

  item.addEventListener('touchend', function (e) {
    clearTimeout(holdTimer);

    if (!isDragging) return;

    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);

    const box = el?.closest('.box');

    if (box) {
      box.appendChild(this);                 // ✅ đổi box được
    } else {
      originalParent.appendChild(this);      // ✅ trả lại vị trí cũ
    }

    resetStyle(this);
    checkAllPlaced();

    touchItem = null;
    originalParent = null;
    isDragging = false;
  });

});

// =====================
// ✅ RESET STYLE
// =====================
function resetStyle(el){
  el.style.position = "";
  el.style.left = "";
  el.style.top = "";
  el.style.zIndex = "";
  el.style.width = "";
  el.classList.remove("dragging");
}

// =====================
// ✅ CHECK ĐÃ KÉO HẾT
// =====================
function checkAllPlaced(){
  const items = document.querySelectorAll('.item');
  let placed = 0;

  items.forEach(item => {
    if(item.parentElement.classList.contains("box")){
      placed++;
    }
  });

  if(placed === items.length){
    document.getElementById("checkBtn").style.display = "inline-block";
  }
}

// =====================
// ✅ CHẤM ĐIỂM + POPUP
// =====================
document.getElementById("checkBtn").addEventListener("click", () => {
  let score = 0;
  let total = 0;

  document.querySelectorAll('.item').forEach(item => {
    total++;

    let imageName = item.dataset.name;
    let category = item.parentElement.dataset.type;

    item.style.border = "4px solid";

    if (correctAnswers[imageName] === category) {
      item.style.borderColor = "green";
      score++;
    } else {
      item.style.borderColor = "red";
    }
  });

  document.getElementById("resultText").innerHTML =
    " Bạn đạt: <b>" + score + " / " + total + "</b>";

  let modal = new bootstrap.Modal(document.getElementById('resultModal'));
  modal.show();
});