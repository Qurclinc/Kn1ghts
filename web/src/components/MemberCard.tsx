interface MemberProps {
    nick: string;
    role: string;
    tags: Array<string>;
    github: string;
}

function MemberCard({ nick, role, tags, github } : MemberProps) {
    return (
        <div className="
            w-full max-w-[320px]
            border border-neon/60 rounded-md 
            p-4 sm:p-5 
            bg-black/70 backdrop-blur 
            shadow-neon hover:shadow-neonStrong transition
            flex flex-col items-center text-center
        ">
            <div className="text-neon text-lg sm:text-xl font-semibold tracking-wide">
                {nick || "Aboba"}
            </div>

            <div className="text-neon/70 text-sm sm:text-base mt-1">
                {role || "no role specified"}
            </div>

            {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                        <span 
                            key={tag}
                            className="
                                text-xs sm:text-sm
                                border border-neon/40 
                                px-2 py-0.5 rounded 
                                text-neon/80
                            "
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {github && (
                <a 
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-sm sm:text-base text-neon/80 hover:text-neon transition self-start"
                >
                    github →
                </a>
            )}
        </div>
    );
}

export default MemberCard;
