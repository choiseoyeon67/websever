import { useState } from 'react'

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState('')

  const addTag = () => {
    if (!input.trim()) return

    if (tags.length >= 5) {
      alert('태그는 최대 5개까지 가능합니다.')
      return
    }

    setTags([...tags, input])
    setInput('')
  }

  const removeTag = target => {
    setTags(tags.filter(tag => tag !== target))
  }

  return (
    <div>
      <div className='flex gap-2'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className='border p-2 flex-1'
        />

        <button
          type='button'
          onClick={addTag}
          className='bg-black text-white px-4'
        >
          추가
        </button>
      </div>

      <div className='flex gap-2 flex-wrap mt-3'>
        {tags.map(tag => (
          <div
            key={tag}
            className='bg-gray-200 px-3 py-1 rounded-full flex gap-2'
          >
            <span>{tag}</span>

            <button onClick={() => removeTag(tag)}>x</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagInput