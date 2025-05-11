document.addEventListener("DOMContentLoaded", () => {
  // DOm elements
  const resetPasswordForm = document.querySelector(".reset_password-form");
  const statusMsg = document.querySelector(".status-msg");

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.querySelector(
        "#reset_password-newPassword"
      ).value;
      const passwordConfirm = document.querySelector(
        "#reset_password-passwordConfirm"
      ).value;

      if (newPassword.length < 8 || newPassword !== passwordConfirm) {
        statusMsg.textContent = "Invalid password or password confirm";
      }

      const resetToken = window.location.pathname.split("/resetPassword/")[1];
      try {
        await axios.post(`/api/users/resetPassword/${resetToken}`, {
          password: newPassword,
          passwordConfirm,
        });
        statusMsg.textContent = "Password reset Successful";
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        console.log(error);
        statusMsg.textContent = "something went wrong. Please try again later!";
      } finally {
        document.querySelector("#reset_password-newPassword").value = "";
        document.querySelector("#reset_password-passwordConfirm").value = "";
      }
    });
  }
});
