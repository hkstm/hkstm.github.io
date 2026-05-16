import Link from 'next/link'
import Three from "@/app/Three";
import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import '../styles/globals.scss'
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons'
import {faEnvelope} from '@fortawesome/free-regular-svg-icons'
import {Chivo_Mono} from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const chivoMono = Chivo_Mono({subsets: ['latin']})

export default function Home() {
    return (
        <div className={chivoMono.className}>

            <br/>
            <div className="socialLinks">
                <a href="https://github.com/hkstm"><u>
                    <FontAwesomeIcon icon={faGithub} size={'xl'} title={'Email'}/>
                </u></a>
                &nbsp; &nbsp;
                <a href="https://www.linkedin.com/in/hkstm"><u>
                    <FontAwesomeIcon icon={faLinkedin} size={'xl'} title={'Email'}/>
                </u></a>
                &nbsp; &nbsp;
                <a href="mailto:hello@hkstm.dev"><u>
                    <FontAwesomeIcon icon={faEnvelope} size={'xl'} title={'Email'}/>
                </u></a>
            </div>

            <div className="typewriter">
                <div className={'my-8'}>
                    <h3 className={'font-extrabold'}>
                        <div className="type-line-1">Hi, thanks for visiting!</div>
                        <br/>
                        <div className="type-line-2">This page is still very much under construction</div>
                        <br/>
                        <div className="type-line-3">Click on the links to my GitHub and LinkedIn to see some of the things I have worked on</div>
                    </h3>
                </div>
                <br/>
                <br/>
                <div className={'my-8'}>
                    <p>
                        Currently, engineering software at Adyen, but if you know of any cool work opportunities, especially those dealing with hardware/IoT/design, feel free to contact me!
                        <br/>
                        <br/>
                        <i>Kailhan Hokstam</i>
                    </p>
                </div>
            </div>
            <div>
                <Three/>
            </div>
        </div>
    )
}
