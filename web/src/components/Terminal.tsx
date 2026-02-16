import { useEffect, useRef, useState } from "react";
import Shell from "../service/shell";

interface TerminalProps {
  onClose: () => void;
}

export default function Terminal({ onClose }: TerminalProps) {
  const shellRef = useRef<Shell>(new Shell());
  const [lines, setLines] = useState<string[]>([
    "Welcome to kn1ghts terminal.",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function runCommand(cmd: string) {
    const shell = shellRef.current;
    const [command, ...args] = cmd.trim().split(" ");

    let output = "";

    if (!command) return;

    if (!shell.allowedCommands.includes(command)) {
      output = `${command}: command not found`;
    } else {
      switch (command) {
        case "help":
          output = shell.help();
          break;
        case "pwd":
          output = shell.pwd();
          break;
        case "ls":
          output = shell.ls(args);
          break;
        case "cat":
          output = shell.cat(args);
          break;
        case "echo":
          output = shell.echo(args.join(" "));
          break;
        case "whoami":
          output = shell.whoami();
          break;
        case "id":
          output = shell.id();
          break;
        case "clear":
          setLines([]);
          return;
        case "exit":
          onClose();
          return;
      }
    }

    setLines((prev) => [
      ...prev,
      `${shell.getPrefix()}${cmd}`,
      output,
    ]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[95%] max-w-4xl h-[70vh] bg-black border border-neon/60 rounded-md shadow-neon flex flex-col font-mono text-sm text-neon">

        {/* Header */}
        <div className="px-4 py-2 border-b border-neon/40 flex justify-between items-center">
          <span>kn1ghts@terminal</span>
          <span className="text-neon/50 text-xs">type "exit" to close</span>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-hidden p-4 whitespace-pre-wrap leading-relaxed">
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
            setInput("");
          }}
          className="border-t border-neon/40 p-3 flex gap-2"
        >
          <span className="text-neon">
            {shellRef.current.getPrefix()}
          </span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neon caret-neon"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
