"use client";

export default function AvatarNavItem({
    avatarSrc,

}: {
    avatarSrc: string;
}) {
    return (
        <div  className="w-11 h-11 rounded-full overflow-hidden cursor-pointer">
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </div>
    );
}
