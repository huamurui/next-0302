import Link from 'next/link'

export default function Tag({ tags }: { tags: string[] }){

  return (
    <div>
      <h3>tags</h3>
        {tags?.map((tag) => (
          <span key={tag}> {tag} </span>
        ))}
    </div>
  )
}