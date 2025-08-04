export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_25%_25%,rgba(56,189,248,0.15),transparent_60%),radial-gradient(at_75%_75%,rgba(244,114,182,0.15),transparent_60%)] dark:bg-[radial-gradient(at_25%_25%,rgba(30,64,175,0.25),transparent_60%),radial-gradient(at_75%_75%,rgba(76,29,149,0.25),transparent_60%)] bg-[length:200%_200%] animate-ambient pointer-events-none" />
  );
}
