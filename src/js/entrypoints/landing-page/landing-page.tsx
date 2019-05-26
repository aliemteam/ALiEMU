import { memo, useState } from '@wordpress/element';

import Logo from 'assets/aliemu-logo-horizontal.svg';
import LightBulbSVG from 'assets/light-bulb.svg';
import RocketSVG from 'assets/rocket.svg';
import Button from 'components/buttons/button';
import Anchor from 'components/elements/anchor';
import Modal from 'components/modal';

import styles from './landing-page.scss';

const Header = memo(() => (
    <div className={styles.header}>
        <header role="banner">
            <nav role="navigation">
                <Anchor href="/courses">Catalog</Anchor>
                <Anchor href="/feedback">Contact</Anchor>
                <Anchor href="/about">About</Anchor>
                <Button href="/login" intent="primary">
                    Sign in
                </Button>
            </nav>
        </header>
    </div>
));
Header.displayName = 'Header';

interface HeroProps {
    onDonateClick(): void;
}
const Hero = memo(
    ({ onDonateClick }: HeroProps) => (
        <div className={styles.hero}>
            <RocketSVG className={styles.heroRocket} />
            <div className={styles.heroContent}>
                <Logo className={styles.heroLogo} />
                <p>
                    Your home for free, high-quality, peer-reviewed online
                    health professions education
                </p>
                <Button href="/login?tab=register" intent="primary" scale={1.5}>
                    Sign up
                </Button>
                <Button
                    intent="secondary"
                    {...{
                        ...(window.innerHeight < 700
                            ? { href: 'https://donorbox.org/aliemu' }
                            : { onClick: onDonateClick }),
                    }}
                    scale={1.5}
                >
                    Donate
                </Button>
            </div>
        </div>
    ),
    () => true,
);
Hero.displayName = 'Hero';

const Mission = memo(() => (
    <div className={styles.mission}>
        <div className={styles.missionContent}>
            <h1>Be Free to Learn</h1>
            <p>
                ALiEMU is an open-access, on-demand, online institution of
                e-courses for healthcare providers in Emergency Medicine and
                health professions education. All content on our platform has
                undergone expert peer review and follows best practices in
                instructional design for learners.
            </p>
        </div>
        <LightBulbSVG />
    </div>
));
Mission.displayName = 'Mission';

const Community = memo(() => (
    <div className={styles.community}>
        <h1>The Community is the Curriculum</h1>
        <p>
            Users can designate coaches, who can track their progress on courses
        </p>
        <div style={{ textAlign: 'center' }}>
            <Button href="/courses" intent="secondary" scale={1.5}>
                Explore our catalog
            </Button>
        </div>
    </div>
));
Community.displayName = 'Community';

export default function LandingPage() {
    const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);
    return (
        <>
            {donationModalIsOpen && (
                <Modal
                    closeOnClickOutside
                    onClose={() => setDonationModalIsOpen(false)}
                >
                    <iframe
                        seamless
                        className={styles.donorbox}
                        name="donorbox"
                        scrolling="no"
                        src="https://donorbox.org/embed/aliemu"
                        title="Donation form"
                        onLoad={e =>
                            e.currentTarget.contentWindow &&
                            e.currentTarget.contentWindow.focus()
                        }
                    />
                </Modal>
            )}
            <main className={styles.main}>
                <div>
                    <Header />
                </div>
                <div>
                    <Hero onDonateClick={() => setDonationModalIsOpen(true)} />
                </div>
                <div>
                    <Mission />
                </div>
                <div>
                    <Community />
                </div>
            </main>
        </>
    );
}
