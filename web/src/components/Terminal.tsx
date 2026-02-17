import { useEffect, useRef, useState } from "react";
import Shell from "../service/shell";

interface TerminalProps {
  onClose: () => void;
}

export default function Terminal({ onClose }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<Shell>(new Shell());
  const [lines, setLines] = useState<string[]>([
    "Welcome to kn1ghts terminal.",
    "Type 'help' to see available commands.",
  ]);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [tabState, setTabState] = useState<{ base: string; index: number } | null>(null);

  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    termRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [lines]);


  function parseArgs(cmd: string): { command: string; args: string[] } | null {
    const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
    const tokens: string[] = [];
    let match;

    while ((match = regex.exec(cmd))) {
      tokens.push(match[1] || match[2] || match[3]);
    }

    if (!tokens.length) return null;
    return { command: tokens[0], args: tokens.slice(1) };
  }

  function normalizeFlags(args: string[]) {
    const flags: string[] = [];
    const rest: string[] = [];

    for (const arg of args) {
      if (arg.startsWith("-")) {
        arg.replace(/^-+/, "")
          .split("")
          .forEach((f) => flags.push(f));
      } else {
        rest.push(arg);
      }
    }

    return { flags, rest };
  }

  function validate(command: string, args: string[]): string | null {
    const shell = shellRef.current;

    if (command === "sudo") return null;
    if (command === "ssh") return null;

    if (!shell.allowedCommands.includes(command)) {
      return `${command}: command not found`;
    }

    if (command === "cat" && args.length === 0) {
      return "cat: missing operand";
    }

    if (command === "ls") {
      const { flags } = normalizeFlags(args);
      for (const f of flags) {
        if (!["l", "a"].includes(f)) {
          return `ls: invalid option -- '${f}'`;
        }
      }
    }

    return null;
  }

  function runCommand(cmd: string) {
    const shell = shellRef.current;
    const parsed = parseArgs(cmd);

    if (!parsed) return;

    const { command, args } = parsed;

    setLines((prev) => [...prev, `${shell.getPrefix()}${cmd}`]);
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);

    if (command === "sudo") {
      setLines((prev) => [
        ...prev,
        "sudo: permission denied: user is not in the sudoers file. Nice try. ;)",
      ]);
      return;
    }

    const error = validate(command, args);
    if (error) {
      setLines((prev) => [...prev, error]);
      return;
    }

    const { flags, rest } = normalizeFlags(args);
    let output = "";

    switch (command) {
      case "help":
        output = shell.help();
        break;
      case "pwd":
        output = shell.pwd();
        break;
      case "ls":
        output = shell.ls(flags);
        break;
      case "cat":
        output = shell.cat(rest);
        break;
      case "echo":
        output = shell.echo(rest.join(" "));
        break;
      case "whoami":
        output = shell.whoami();
        break;
      case "id":
        output = shell.id();
        break;
      case "neofetch":
        output = shell.neofetch();
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        onClose();
        return;
    }

    if (output) setLines((prev) => [...prev, output]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    
    // HOTKEYS
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setLines((prev) => [...prev, "^C"]);
      setInput("");
      return;
    }

    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setInput((s) => s.slice(0, -1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;

      if (historyIndex === null) {
        setDraft(input);
        setHistoryIndex(history.length - 1);
        setInput(history.at(-1)!);
      } else {
        const next = Math.max(0, historyIndex - 1);
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;

      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput(draft);
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const shell = shellRef.current;

      const parts = input.split(" ");
      const base = parts.at(-1) || "";

      const pool =
        parts.length === 1
          ? shell.allowedCommands.concat(["sudo", "ssh"])
          : Array.from(shell.files.keys());

      const matches = pool.filter((p) => p.startsWith(base));
      if (!matches.length) return;

      const idx = tabState?.index ?? 0;
      const next = matches[idx % matches.length];

      const updated = [...parts];
      updated[updated.length - 1] = next;

      setInput(updated.join(" "));
      setTabState({ base, index: idx + 1 });
      return;
    }

    setTabState(null);

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setInput((s) => s + e.key);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[95%] max-w-4xl h-[70vh] bg-black border border-neon/60 rounded-md shadow-neon flex flex-col font-mono text-sm text-neon">
        <div className="px-4 py-2 border-b border-neon/40 flex justify-between items-center">
          <span>kn1ghts@terminal</span>
          <span className="text-neon/50 text-xs">exit | esc | ctrl+l | ctrl+c</span>
        </div>

        <div
          ref={scrollRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex-1 overflow-y-auto p-4 whitespace-pre-wrap leading-relaxed outline-none cursor-text"
        >

          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}

          <div className="flex">
            <span>{shellRef.current.getPrefix()}</span>
            <span>{input}</span>
            <span className="animate-pulse ml-1">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}
