import React, { PureComponent } from 'react';

import Button from 'components/buttons/button';
import Anchor from 'components/elements/anchor';
import { AbstractModal } from 'components/modal';

import Logo from '../../assets/aliemu-logo-horizontal.svg';
import LightBulbSVG from '../../assets/light-bulb.svg';
import RocketSVG from '../../assets/rocket.svg';

import { Intent } from 'utils/constants';
import styles from './landing-page.scss';

interface State {
    donationModalIsOpen: boolean;
}

export default class LandingPage extends PureComponent<{}, State> {
    state = {
        donationModalIsOpen: false,
    };
    render(): JSX.Element {
        const { donationModalIsOpen } = this.state;
        return (
            <>
                {donationModalIsOpen && (
                    <DonationModal
                        closeOnClickOutside
                        onClose={this.toggleDonationModal}
                    />
                )}
                <main className={styles.main}>
                    <div>
                        <Header />
                    </div>
                    <div>
                        <Hero onDonateClick={this.toggleDonationModal} />
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

    private toggleDonationModal = (): void => {
        this.setState(prev => ({
            ...prev,
            donationModalIsOpen: !prev.donationModalIsOpen,
        }));
    };
}

class DonationModal extends AbstractModal {
    renderContent() {
        return (
            <iframe
                seamless
                className={styles.donorbox}
                name="donorbox"
                scrolling="no"
                src="https://donorbox.org/embed/aliemu"
                title="Donation form"
            />
        );
    }
}

const Header = (): JSX.Element => (
    <div className={styles.header}>
        <header role="banner">
            <nav role="navigation">
                <Anchor href="/courses">Catalog</Anchor>
                <Anchor href="/feedback">Contact</Anchor>
                <Anchor href="/about">About</Anchor>
                <Button href="/login" intent={Intent.PRIMARY}>
                    Sign in
                </Button>
            </nav>
        </header>
    </div>
);

interface HeroProps {
    onDonateClick(): void;
}

const Hero = ({ onDonateClick }: HeroProps): JSX.Element => (
    <div className={styles.hero}>
        <RocketSVG className={styles.heroRocket} />
        <div className={styles.heroContent}>
            <Logo className={styles.heroLogo} />
            <p>
                Your home for free, high-quality, peer-reviewed online health
                professions education
            </p>
            <Button
                href="/login?tab=register"
                intent={Intent.PRIMARY}
                scale={1.5}
            >
                Sign up
            </Button>
            <Button
                intent={Intent.SECONDARY}
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
);

const Mission = (): JSX.Element => (
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
);

const Community = (): JSX.Element => (
    <div className={styles.community}>
        <h1>The Community is the Curriculum</h1>
        <p>
            Users can designate coaches, who can track their progress on courses
        </p>
        <div style={{ textAlign: 'center' }}>
            <Button href="/courses" intent={Intent.SECONDARY} scale={1.5}>
                Explore our catalog
            </Button>
        </div>
    </div>
);
