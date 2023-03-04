import styles from './tag.module.css'


export default function Tag({ tags }: { tags: string[] }){

  let choice:string[] = []
  if(!(typeof window === "undefined"))
    if(localStorage.getItem('choice'))
      choice = localStorage.getItem('choice')?.split(',') as string[]
    else if(!localStorage.getItem('choice'))
      localStorage.setItem('choice', '')

  // setTagActive() // 想要的是...刷新后，还是上次的选择，然鹅，怎么在木的点击事件的情况下去拿到 dom 呢。。该死的 ssr。怎么这点东西都弄不成啊...这该死的。。
  function setTagActive(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    let target = e.target as HTMLSpanElement
    if ( target.tagName === 'SPAN' ) {
      if ( target.classList.contains(styles.active) ) {
        target.classList.remove(styles.active)
        choice = choice.filter((item) => item !== target.innerText)
      } else {
        target.classList.add(styles.active)
        choice.push(target.innerText)
      }
      localStorage.setItem('choice', choice.join(','))
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