import styles from './tag.module.css'
import { useState } from 'react'


// const [choice, setChoice] = useState([])
// why useState is undefined out of the component?

export const getChoice = () => {
  return []
}

export default function Tag({ tags }: { tags: string[] }){
  // const [choice, setChoice] = useState([])
  function setTagActive(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    const target = e.target as HTMLSpanElement
    const tag = target.textContent
    if(target.classList.contains(styles.item)){
      if (target.classList.contains(styles.active) ) {
        target.classList.remove(styles.active)
        // setChoice(choice.filter(item => item !== tag))
      } else {
        target.classList.add(styles.active)
        // setChoice([...choice, tag])
      }
    }
  }


  return (
    <div >
      <h3>tags</h3>
        <div className={styles.container} onClick={ setTagActive }>
        {tags?.map((tag) => (
          <span className={`${styles.item}`} key={tag}> {tag} </span>
        ))}
        </div>
    </div>
  )
}