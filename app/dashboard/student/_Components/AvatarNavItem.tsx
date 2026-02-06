"use client";

export default function AvatarNavItem({
    avatarSrc,
    avatarRef,

}: {
    avatarSrc: string;
    avatarRef: React.RefObject<HTMLDivElement | null>;

}) {
    return (
        <div ref={avatarRef} className="w-11 h-11 rounded-full overflow-hidden cursor-pointer">
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </div>
    );
}
