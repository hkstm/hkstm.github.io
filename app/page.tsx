import Three from "@/app/Three";
import '../styles/globals.scss'
import {Chivo_Mono} from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const chivoMono = Chivo_Mono({subsets: ['latin']})

export default function Home() {
    return (
        <div className={chivoMono.className}>

            <br/>
            <div className="socialLinks" aria-label="Social links">
                <a className="socialLink linkAnimation hasExternalIcon" href="https://github.com/hkstm" target="_blank" rel="noreferrer">
                    GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                        <path fill="currentColor" d="M11 8H9.5V3.56L5.071 7.99l-1.06-1.061L8.44 2.5H4V1h7v7Z" />
                    </svg>
                </a>
                <a className="socialLink linkAnimation hasExternalIcon" href="https://www.linkedin.com/in/hkstm" target="_blank" rel="noreferrer">
                    LinkedIn
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                        <path fill="currentColor" d="M11 8H9.5V3.56L5.071 7.99l-1.06-1.061L8.44 2.5H4V1h7v7Z" />
                    </svg>
                </a>
                <a className="socialLink linkAnimation hasExternalIcon" href="mailto:hello@hkstm.dev">
                    hello@hkstm.dev
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                        <path fill="currentColor" d="M11 8H9.5V3.56L5.071 7.99l-1.06-1.061L8.44 2.5H4V1h7v7Z" />
                    </svg>
                </a>
            </div>

            <div className="typewriter">
                <div className={'my-8'}>
                    <h3 className={'font-extrabold'}>
                        <div className="type-line-1">Hi, thanks for visiting!</div>
                        <br/>
                        <div className="type-line-2">This page is still very much under construction</div>
                        <br/>
                        <div className="type-line-3">Click on the links to my GitHub and LinkedIn to see</div>
                        <br/>
                        <div className="type-line-4">some of the things I have worked on.</div>
                    </h3>
                </div>
                <br/>
                <div className={'my-8'}>
                    <p>
                        Currently happily building platforms & products powered by software at Adyen, but if you know of any cool work opportunities, especially those dealing with hardware/IoT, feel free to contact me!
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
