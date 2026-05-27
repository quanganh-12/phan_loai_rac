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


let originalParent = null;
let draggedItem = null;
let touchItem = null;

// =====================
// ✅ DESKTOP DRAG
// =====================
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
// ✅ MOBILE DRAG REAL (kéo theo tay)
// =====================
document.querySelectorAll('.item').forEach(item => {

  item.addEventListener('touchstart', function (e) {
  touchItem = this;
  originalParent = this.parentElement; // ✅ lưu chỗ cũ

  const rect = this.getBoundingClientRect();

  this.style.position = "absolute";
  this.style.left = rect.left + "px";
  this.style.top = rect.top + "px";
  this.style.width = rect.width + "px";
  this.style.zIndex = "1000";

  document.body.appendChild(this); // ✅ kéo ra ngoài
  });



  item.addEventListener('touchmove', function (e) {
    if (!touchItem) return;

    const touch = e.touches[0];

    this.style.left = touch.pageX - this.offsetWidth / 2 + "px";
    this.style.top = touch.pageY - this.offsetHeight / 2 + "px";

  });

  item.addEventListener('touchend', function (e) {
    if (!touchItem) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    const box = dropTarget.closest('.box');

    if (box) {
      box.appendChild(touchItem);
      resetStyle(touchItem);
      checkAllPlaced();
    } else {
      // Nếu thả ra ngoài → trả về vị trí cũ
      resetStyle(touchItem);
    }

    touchItem = null;
  });

});

// reset style sau khi thả
function resetStyle(el){
  el.style.position = "";
  el.style.left = "";
  el.style.top = "";
  el.style.zIndex = "";
  el.style.width = "";
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