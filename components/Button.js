import Link from 'next/link'

const Button = ({type, name, link, delay = 500, bare = false, arr = false}) => {
  return (
    <div uk-scrollspy={`cls: uk-animation-fade; delay: ${delay}`}>
      {type === 'inter' && <Link href={!arr ? `${link.type === 'jobOff' ? '/kariera' : ''}/${link.slug}` : link}>
        <a className={`button ${bare ? ' bare' : ''}`}>
          {name}
          <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
        </a>
      </Link>}
      {type === 'exter' && <Link href={link}>
        <a className={`button not-anim ${bare ? ' bare' : ''}`}>
          {name}
          <img className="uk-svg" src="/assets/exter.svg" uk-svg="" alt="Right"/>
        </a>
      </Link>}
      {type === 'mail' && <Link href={`mailto:${link}`}>
        <a className={`button not-anim ${bare ? ' bare' : ''}`}>
          {name}
          <img className="uk-svg" src="/assets/envelope.svg" uk-svg="" alt="Right"/>
        </a>
      </Link>}
    </div>
  )
}

export default Button
