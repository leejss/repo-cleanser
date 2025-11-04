export default function ConnectButton() {
  return (
    <button
      onClick={() => {
        window.location.href = "/api/auth/github";
      }}
    >
      Connect with Github
    </button>
  );
}
