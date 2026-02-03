document.addEventListener("DOMContentLoaded", () => {

  /* SLIDER */
  const track = document.getElementById("sliderTrack");
  const total = track.children.length;
  let index = 0;

  function updateSlider(){
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide(){
    index = (index + 1) % total;
    updateSlider();
  }

  function prevSlide(){
    index = (index - 1 + total) % total;
    updateSlider();
  }

  let autoSlide = setInterval(nextSlide, 3000);

  document.getElementById("nextBtn").onclick = () => {
    nextSlide();
    resetAuto();
  };

  document.getElementById("prevBtn").onclick = () => {
    prevSlide();
    resetAuto();
  };

  function resetAuto(){
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 3000);
  }

  /* REVIEW MODAL */
  const modal = document.getElementById("reviewModal");

  document.getElementById("openReviews").onclick = () => {
    modal.style.display = "flex";
  };

  document.getElementById("closeReviews").onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if(e.target === modal){
      modal.style.display = "none";
    }
  };

  /* CHAT & CALL */
  document.getElementById("chatBtn").onclick = () => {
    alert("Chat feature coming soon!");
  };

  document.getElementById("callBtn").onclick = () => {
    alert("Call feature coming soon!");
  };
});
