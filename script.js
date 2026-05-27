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

let touchItem = null;
let draggedItem = null;

/* ======================
 ✅ KÉO PC
====================== */
document.querySelectorAll('.item').forEach(item => {

  // PC drag
  item.addEventListener('dragstart', function () {
    draggedItem = this;
  });

  // MOBILE start
  item.addEventListener('touchstart', function () {
    touchItem = this;
    this.classList.add('dragging');
  });

});

/* ======================
 ✅ THẢ PC
====================== */
document.querySelectorAll('.box').forEach(box => {

  box.addEventListener('dragover', e => e.preventDefault());

  box.addEventListener('drop', function () {
    this.appendChild(draggedItem);
    checkAllPlaced();
  });

});

/* ======================
 ✅ MOBILE MOVE (di chuyển theo tay)
====================== */
document.addEventListener('touchmove', function (e) {
  if (!touchItem) return;

  const touch = e.touches[0];

  touchItem.style.position = "absolute";
  touchItem.style.left = (touch.clientX - 50) + "px";
  touchItem.style.top = (touch.clientY - 50) + "px";
  touchItem.style.zIndex = 1000;
});

/* ======================
 ✅ MOBILE DROP (QUAN TRỌNG)
====================== */
document.addEventListener('touchend', function (e) {
  if (!touchItem) return;

  const touch = e.changedTouches[0];

  const target = document.elementFromPoint(
    touch.clientX,
    touch.clientY
  );

  const dropBox = target.closest('.box');

  if (dropBox) {
    dropBox.appendChild(touchItem);
  }

  // reset vị trí
  touchItem.style.position = "static";
  touchItem.style.left = "";
  touchItem.style.top = "";
  touchItem.style.zIndex = "";
  touchItem.classList.remove('dragging');

  touchItem = null;

  checkAllPlaced();
});

/* ======================
 ✅ CHECK ĐÃ ĐẶT HẾT
====================== */
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

/* ======================
 ✅ CHECK KẾT QUẢ
====================== */
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