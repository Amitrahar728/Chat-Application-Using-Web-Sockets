// import { useEffect, useRef, useState } from 'react'
// import './App.css'

// function App() {
//   const [messages, setMessage] = useState<string[]>([]);
//   const wsRef = useRef<WebSocket | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8080");

//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         type: "join",
//         payload: {
//           roomId: "red"
//         }
//       }));
//     }

//     ws.onmessage = (event) => {
//       setMessage(m => [...m, event.data]);
//     }

//     wsRef.current = ws;
//     return () => ws.close();
//   }, []);

//   return (
//     <div className='h-screen bg-black'>
//       <div className='h-[85vh] overflow-y-auto'>
//         {messages.map((message, index) => (
//           <div key={index} className='m-8'>
//             <span className='bg-white text-black rounded p-4'>
//               {message}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className='w-full bg-white flex'>
//         <input ref={inputRef} className='text w-full p-4 m-4' />
//         <button onClick={() => {
//           const message = inputRef.current?.value;
//           if (message && wsRef.current) {
//             wsRef.current.send(JSON.stringify({
//               type: "chat",
//               payload: { message }
//             }));
//             inputRef.current!.value = '';
//           }
//         }} className='bg-purple-600 text-white p-4'>
//           Send message
//         </button>
//       </div>
//     </div>
//   )
// }

// export default App

import { useEffect, useRef, useState } from 'react'

type Screen = 'home' | 'chat'

interface Message {
  text: string
  self: boolean
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [roomId, setRoomId] = useState('')
  const [joinInput, setJoinInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [copied, setCopied] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!roomId) return

    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', payload: { roomId } }))
    }

    ws.onmessage = (event) => {
      setMessages(m => [...m, { text: event.data, self: false }])
    }

    wsRef.current = ws
    return () => ws.close()
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleCreate() {
    const code = generateRoomCode()
    setRoomId(code)
    setScreen('chat')
  }

  function handleJoin() {
    const code = joinInput.trim().toUpperCase()
    if (!code) return
    setRoomId(code)
    setScreen('chat')
  }

  function handleSend() {
    const msg = inputRef.current?.value.trim()
    if (!msg || !wsRef.current) return
    wsRef.current.send(JSON.stringify({ type: 'chat', payload: { message: msg } }))
    setMessages(m => [...m, { text: msg, self: true }])
    inputRef.current!.value = ''
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (screen === 'home') {
    return (
      <div className='min-h-screen bg-zinc-950 flex items-center justify-center px-4'>
        <div className='w-full max-w-sm'>
          <div className='mb-10 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 mb-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A8.949 8.949 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
            </div>
            <h1 className='text-2xl font-semibold text-white tracking-tight'>RoomChat</h1>
            <p className='text-zinc-500 text-sm mt-1'>Private rooms. No accounts.</p>
          </div>

          <div className='space-y-3'>
            <button
              onClick={handleCreate}
              className='w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-4 rounded-xl transition-colors'
            >
              Create a room
            </button>

            <div className='relative flex items-center gap-2'>
              <input
                value={joinInput}
                onChange={e => setJoinInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder='Enter room code'
                className='w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 py-3 px-4 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-sm uppercase tracking-widest'
              />
              <button
                onClick={handleJoin}
                className='shrink-0 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm'
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen bg-zinc-950 flex flex-col'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-zinc-800'>
        <button
          onClick={() => { setScreen('home'); setRoomId(''); setMessages([]) }}
          className='text-zinc-500 hover:text-white transition-colors'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <div className='text-center'>
          <p className='text-xs text-zinc-500'>room code</p>
          <p className='text-white font-mono font-semibold tracking-widest text-sm'>{roomId}</p>
        </div>
        <button
          onClick={handleCopy}
          className='text-zinc-500 hover:text-white transition-colors text-xs font-medium'
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-2'>
        {messages.length === 0 && (
          <div className='flex items-center justify-center h-full'>
            <p className='text-zinc-600 text-sm text-center'>
              Share code <span className='font-mono text-zinc-400'>{roomId}</span> to invite others
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
            <span className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
              msg.self
                ? 'bg-violet-600 text-white rounded-br-sm'
                : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className='px-4 py-3 border-t border-zinc-800 flex gap-2'>
        <input
          ref={inputRef}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder='Message...'
          className='flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 py-3 px-4 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-sm'
        />
        <button
          onClick={handleSend}
          className='bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl transition-colors'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default App