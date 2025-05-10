// import axios from "axios";
document.addEventListener("DOMContentLoaded", () => {
  //DOM elements
  const forgetPasswordForm = document.querySelector(".forget_password-form");
  const statusMsg = document.querySelector(".status-msg");
  //delgation
  if (forgetPasswordForm) {
    forgetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#forget_password_email").value;
      console.log(email);
      try {
        axios.post("/api/users/forgetPassword", { email });
        statusMsg.textContent = "Reset Email Sent!";
      } catch (e) {
        console.log(e);
        statusMsg.textContent = "Please try again after sometime!";
      }
    });
  }
});
