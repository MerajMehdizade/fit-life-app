export default function ConfettiLayer({ confetti }: { confetti: any[] }) {
  return (
    <>
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "fixed",
            top: "-10px",
            left: `${c.left}vw`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotate}deg)`,
            borderRadius: "50%",
            animation: `confetti-fall ${c.duration}s linear forwards`,
            zIndex: 9999,
          }}
        />
      ))}

      <style>
        {`
          @keyframes confetti-fall {
            0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
    </>
  );
}
