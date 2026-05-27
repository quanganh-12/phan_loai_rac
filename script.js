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

// kéo
document.querySelectorAll('.item').forEach(item => {

  // desktop
  item.addEventListener('dragstart', function () {
    draggedItem = this;
  });

  // mobile
  item.addEventListener('touchstart', function () {
    touchItem = this;
    this.classList.add('dragging');
  });

});

// thả
document.querySelectorAll('.box').forEach(box => {

  // desktop
  box.addEventListener('dragover', e => e.preventDefault());

  box.addEventListener('drop', function () {
    this.appendChild(draggedItem);
    checkAllPlaced();
  });

  // mobile
  box.addEventListener('touchmove', e => {
    e.preventDefault();
  });

  box.addEventListener('touchend', function () {
    if (touchItem) {
      this.appendChild(touchItem);
      touchItem.classList.remove('dragging');
      touchItem = null;
      checkAllPlaced();
    }
  });

}); // ✅ đóng forEach đúng

// hiện nút khi đã kéo hết
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

// kiểm tra
document.getElementById("checkBtn").addEventListener("click", () => {

  let promises = [];
  let score = 0;

  document.querySelectorAll('.item').forEach(item => {

    let imageName = item.dataset.name;
    let category = item.parentElement.dataset.type;

    promises.push(
      fetch('/check', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          image: imageName,
          category: category
        })
      })
      .then(res => res.json())
      .then(data => {
        item.style.border = "4px solid";

        if(data.correct){
          item.style.borderColor = "green";
          score++;
        } else {
          item.style.borderColor = "red";
        }
      })
    );
  });

});

// popup
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
