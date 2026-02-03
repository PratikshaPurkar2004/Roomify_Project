let isSubscribed = false;

function openProfile(name) 
{
  alert("Opening profile of " + name);
}


function openChat(name)
{
  if (!isSubscribed) {
    document.getElementById("subscribePopup").style.display = "flex";
    return;
  }
  document.getElementById("chatUser").innerText = name;
  document.getElementById("chatBox").style.display = "block";
}

function closeChat() 
{
  document.getElementById("chatBox").style.display = "none";
}

function sendMessage() 
{
  const input = document.getElementById("chatInput");
  if (!input.value.trim()) 
    return;
  const msg = document.createElement("div");
  msg.innerText = "You: " + input.value;
  document.getElementById("chatBody").appendChild(msg);
  input.value = "";
}


function takeSubscription() {
  isSubscribed = true;
  closeSubscribePopup();
  alert("Subscription Activated!");
}

function closeSubscribePopup() 
{
  document.getElementById("subscribePopup").style.display = "none";
}

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;

    cards.forEach(card => {
      if (filter === "all")
      {
        card.style.display = "flex";
      } else 
        {
        card.style.display =
          card.dataset.type === filter ? "flex" : "none";
      }
    });
  });
});
