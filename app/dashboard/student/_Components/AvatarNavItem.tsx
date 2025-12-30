"use client";

export default function AvatarNavItem({
    avatarSrc,
    avatarRef,
    onClick,
}: {
    avatarSrc: string;
    avatarRef: React.RefObject<HTMLDivElement | null>;
    onClick: () => void;
}) {
    return (
        <div ref={avatarRef} onClick={onClick} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </div>
    );
}
