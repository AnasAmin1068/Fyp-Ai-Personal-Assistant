'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState, useContext } from 'react'
import AiModelOptions from '@/services/AiModelOptions'
import axios from 'axios'
import { AssistantContext } from '@/context/AssistantContext'
import { SparklesText } from '@/components/magicui/sparkles-text'

const ChatUi = () => {
  const { assistant } = useContext(AssistantContext)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSendMessage = async () => {
    if (!input.trim() || !assistant) return

    const AIModel = AiModelOptions.find(model => model.name === assistant.aiModelId)
    if (!AIModel) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Model not found.' }])
      return
    }

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/openai', {
        provider: AIModel.edenAi,
        userInput: input,
      })

      const assistantResponse = response.data?.content?.trim()

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: assistantResponse || '⚠️ No response from AI.',
        },
      ])
    } catch (err) {
      console.error('API Error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Something went wrong while generating a response.' },
      ])
    }

    setIsLoading(false)
  }

  return (
    <div className='mt-20 p-6 relative h-[88vh] flex flex-col items-center'>

      {/* Top Welcome Header */}
      <div className='w-full max-w-3xl text-center mb-6'>
        <SparklesText>
        <h1 className='text-3xl text-gray-800'>How Can I Assist You?</h1>
        </SparklesText>;

        {assistant && (
          <>
            <p className='text-xl font-bold text-gray-600'>{assistant.title}</p>
            <div className='mt-2 text-sm  text-gray-500 italic'>
              {/* {assistant.sampleQuestions?.length > 0 && ( */}
                <p>Try asking: <span className='font-medium'>" Can you solve my Problem "</span></p>
              {/* )} */}
            </div>
          </>
        )}
      </div>

      {/* Chat Display */}
      <div className='flex flex-col gap-2 w-full max-w-3xl overflow-y-auto mb-28'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100 self-start text-left'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : assistant?.name || 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className='text-gray-500 italic self-start'>AI is typing...</div>
        )}
      </div>

      {/* Input Box */}
      <div className='flex justify-between gap-5 p-5 fixed bottom-0 w-[95%] max-w-4xl bg-white'>
        <Input
          placeholder='Start typing here...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button onClick={onSendMessage} disabled={isLoading}>
          <Send className={isLoading ? 'animate-pulse' : ''} />
        </Button>
      </div>
    </div>
  )
}

export default ChatUi
