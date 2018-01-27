<?php
$placeholder_img = 'team-placeholder.svg';
get_header();

function aliemu_team_member( $name, $img, $title, $role, $twitter ) {
	?>
	<div class="team-member">
		<img class="team-member__photo" src="/wp-content/themes/aliemu/assets/team/<?=$img?>" alt="Photograph of <?=$name?>"/>
		<div class="team-member__info">
			<div class="team-member__name">
				<?php if ( $twitter ): ?>
					<a href="https://twitter.com/<?=$twitter?>" aria-label="View Twitter profile">
						<svg height="25px" width="25px" aria-labelledby="simpleicons-twitter-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<title id="simpleicons-twitter-icon">Twitter icon</title>
							<path fill="#1DA1F2" d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
						</svg>
					</a>
				<?php endif; ?>
				<span><?=$name?></span>
			</div>
			<div class="team-member__title"><?=$title?></div>
			<div class="team-member__role"><?=$role?></div>
		</div>
	</div>
	<?php
}

?>

<section id="content" class="content-area">
	<main role="main" style="padding-top: 0">
		<header class="au-team-header">
			<h1>Core Team</h1>
		</header>
		<div class="au-team-container">
		<?php
			aliemu_team_member( "Michelle Lin, MD", "michelle-lin.png", "Professor of EM and Academy Endowed Chair for EM Education, UC San Francisco", "Co-Founder, ALiEMU", "mlin" );
			aliemu_team_member( "Chris Gaafary, MD", "chris-gaafary.png", "EM Chief Resident, University of Tennessee Chattanooga", "Co-Founder / Chief of Design and Development, ALiEMU", "cgaafary" );
			aliemu_team_member( "Andrew Grock, MD", "andy-grock.png", "Assistant Professor of Emergency Medicine UCLA Department of Emergency Medicine", "Creator and Lead Editor, ALiEM AIR Series", "andygrock" );
			aliemu_team_member( "Bryan Hayes, PharmD", "bryan-hayes.png", "Clinical Associate Professor, University of Maryland", "Creator and Lead Editor, ALiEM Capsules Series", "pharmertoxguy" );
			aliemu_team_member( "Derek Sifford, FP-C, CCP-C", "derek-sifford.png", "Paramedic. Undergraduate Student. ALiEM CTO", "Chief Technical Officer, ALiEMU", "flightmed1" );
			aliemu_team_member( "Jonathan Bronner, MD", "jonathan-bronner.png", "Assistant Professor And Assistant Program Director, University of Kentucky Department of EM", "ALiEMU Education Design Officer", "Bronski_EM" );
			aliemu_team_member( "Nikita Joshi, MD", "nikita-joshi.png", "Clinical Instructor, Stanford University, Department of EM", "Member, ALiEMU Advisory Board", "njoshi8" );
			aliemu_team_member( "Teresa Chan, MD", "teresa-chan.png", "Assistant Professor, McMaster University", "Member, ALiEMU Advisory Board", "tchanmd" );
			aliemu_team_member( "Brent Thoma, MD", "brent-thoma.png", "Simulation Fellow, Massachusetts General Hospital", "Member, ALiEMU Advisory Board", "brent_thoma" );
		?>
		</div>

		<header class="au-team-header au-air-team">
			<h1>Air Team</h1>
		</header>
		<div class="au-team-container">
		<?php
			aliemu_team_member( "Andrew Grock, MD", "andy-grock.png", "Assistant Professor of Emergency Medicine UCLA Department of Emergency Medicine", "Creator and Lead Editor, ALiEM AIR Series", "andygrock" );
			aliemu_team_member( "Michelle Lin, MD", "michelle-lin.png", "Professor of EM and Academy Endowed Chair for EM Education, UC San Francisco", "Founder, ALiEMU", "mlin" );
			aliemu_team_member( "Nikita Joshi, MD", "nikita-joshi.png", "Clinical Instructor, Stanford University, Department of EM", "Member, ALiEMU Advisory Board", "njoshi8" );
			aliemu_team_member( "Eric Morley, MD", "eric-morley.png", "Associate Program Director of EM; Stony Brook University", "Associate Director AIR Executive Board", "emericmorley" );
			aliemu_team_member( "Felix Ankel, MD", "felix-ankel.png", "VP & Exec Director of Health Prof Education, HealthPartners Institute; Associate Professor of EM; Univ of Minnesota", "", "felixankel" );
			aliemu_team_member( "Jeremy Branzetti, MD", "jeremy-branzetti.png", "Associate Program Director and Assistant Professor of EM; University of Washington Department of EM", "", "thebranzetti" );
			aliemu_team_member( "Jay Khadpe, MD", "jay-khadpe.png", "Assistant Residency Director at Kings County Hospital Center / SUNY Downstate Medical Center", "", "flatbushem" );
			aliemu_team_member( "Kasey Mekonnen, MD", "kasey-mekonnen.png", "Resident, Alameda-Highland Emergency Medicine Residency Program", "", "kmekonnenEM" );
			aliemu_team_member( "Allie Min, MD", "allie-min.png", "Associate Professor; Associate Residency Director, University of Arizona – University Campus", "", "" );
			aliemu_team_member( "Salim Rezaie, MD", "salim-rezaie.png", "Associate Clinical Professor of EM/IM; University of Texas Health Science Center at San Antonio", "", "srrezaie" );
			aliemu_team_member( "Lynn Roppolo, MD", "lynn-roppollo.png", "Associate Professor, Associate Residency Program Director at UT Southwestern Medical Center Dallas", "", "lynnroppolo" );
			aliemu_team_member( "Anand Swaminathan MD MPH", "anand-swaminathan.png", "Assistant Program Director and Assistant Professor of EM, NYU Medical Center", "", "emswami" );
			aliemu_team_member( "Taku Taira, MD", "taku-taira.png", "Associate Program Director and Assistant Professor of EM, USC School of Medicine", "", "takutaira" );
			aliemu_team_member( "Lalena Yarris MD MCR", "lalena-yarris.png", "Program Director and Associate Professor of EM; Oregon Health Sciences University", "", "" );
		?>
		</div>

		<header class="au-team-header au-capsules-team">
			<h1>Capsules Team</h1>
		</header>
		<div class="au-team-container">
		<?php
			aliemu_team_member( "Bryan Hayes, PharmD", "bryan-hayes.png", "Clinical Associate Professor, University of Maryland", "Creator and Lead Editor, ALiEM Capsules Series", "pharmertoxguy" );
			aliemu_team_member( "Nadia I. Awad, PharmD, BCPS", "nadia-awad.png", "Emergency Medicine Pharmacist, Robert Wood Johnson University Hospital (New Brunswick, New Jersey)", "", "Nadia_EMPharmD" );
			aliemu_team_member( "Craig Cocchio, PharmD, BCPS", "craig-coccio.png", "Emergency Medicine Pharmacist, Ernest Mario School of Pharmacy (Rutgers), Robert Wood Johnson University Hospital", "", "iEMPharmD" );
			aliemu_team_member( "Zlatan Coralic, PharmD, BCPS", "zlatan-coralic.png", "Emergency Medicine Pharmacist, Assistant Clinical Professor, University of California San Francisco", "", "ZEDPharm" );
			aliemu_team_member( "Chris Edwards, PharmD, BCPS", "chris-edwards.png", "Emergency Medicine Pharmacist, University of Arizona Medical Center", "", "emergencypharm" );
			aliemu_team_member( "Douglas Gowen, PharmD, BCPS", $placeholder_img, "Emergency Medicine Pharmacist, Glens Falls Hospital (Glens Falls, New York)", "", "DougEDPharm" );
			aliemu_team_member( "Meghan Groth, PharmD, BCPS", "meghan-groth.png", "Emergency Medicine Pharmacist, University of Vermont Medical Center", "", "EMpharmgirl" );
			aliemu_team_member( "Michelle Hines, PharmD", "michelle-hines.png", "Emergency Medicine Pharmacist, University of Maryland Medical Center", "", "mEDpharmD" );
			aliemu_team_member( "Jill Logan, PharmD, BCPS", "jill-logan.png", "Emergency Medicine Pharmacist, Baltimore Washington Medical Center", "", "EMPharm" );
			aliemu_team_member( "Glenn Oettinger, PharmD, BCPS", "glenn-oettinger.png", "Emergency Medicine Pharmacist, Thomas Jefferson University", "", "glennoettinger" );
			aliemu_team_member( "Rob Pugliese, PharmD, BCPS", "robert-pugliese.png", "Emergency Medicine Pharmacist, Thomas Jefferson University", "", "theEDpharmacist" );
			aliemu_team_member( "Adam Spaulding, PharmD, BCPS", "adam-spaulding.png", "Emergency Medicine Pharmacist, Waterbury Hospital Health Center", "", "PharmERAtom" );
			aliemu_team_member( "Paul Takamoto, PharmD", "paul-takamoto.png", "Emergency Medicine Pharmacist, University of California San Francisco", "", "ptakEDRx" );
			aliemu_team_member( "Mark Culver, PharmD, BCPS", "mark-culver.png", "Emergency Medicine Pharmacist, Banner University Medical Center (Phoenix)", "", "EMdruggist" );
			aliemu_team_member( "Lewis Nelson, MD, FAACT, FACMT, FACEP", "lewis-nelson.png", "Professor of Emergency Medicine, New York University", "", "LNelsonMD" );
			aliemu_team_member( "Michael Winters, MD, FAAEM, FACEP", "michael-winters.png", "Associate Professor of Emergency Medicine and Internal Medicine, University of Maryland", "", "critcareguys" );
			aliemu_team_member( "David Juurlink, BPharm, MD, PhD, FRCPC", "david-juurlink.png", "Professor of Medicine, University of Toronto", "", "DavidJuurlink" );
		?>
		</div>

		<header class="au-team-header au-airpro-team">
			<h1>AIR-Pro Team</h1>
		</header>
		<div class="au-team-container">
		<?php
			aliemu_team_member( "Fareen Zaver, MD FRCPC EM", "fareen-zaver.png", "Clinical Lecturer, University of Calgary", "Creator and Lead Editor, ALiEM AIR-Pro Series", "fzaver" );
			aliemu_team_member( "Michelle Lin, MD", "michelle-lin.png", "Professor of EM and Academy Endowed Chair for EM Education, UC San Francisco", "Founder, ALiEMU", "mlin" );
			aliemu_team_member( "Robert Cooney, MD", "rob-cooney.png", "Associate Program Director, Geisinger Medical Center", "", "EMEducation" );
			aliemu_team_member( "Lynn Roppolo, MD", "lynn-roppollo.png", "Associate Professor, Associate Residency Program Director at UT Southwestern Medical Center Dallas", "", "lynnroppolo" );
			aliemu_team_member( "Salim Rezaie, MD", "salim-rezaie.png", "Associate Clinical Professor of EM/IM; University of Texas Health Science Center at San Antonio", "", "srrezaie" );
			aliemu_team_member( "Jeff Riddell, MD", "jeff-riddell.png", "Education Fellow, University of Washington; Medical Education Research Fellow, Division of Emergency Medicine, University of Washington", "", "jeff__riddell" );
			aliemu_team_member( "Seth Trueger, MD, MPH", "seth-trueger.png", "Department of Emergency Medicine, Northwestern University", "", "MDaware" );
			aliemu_team_member( "Sam Ghali, MD", $placeholder_img, "", "", "em_resus" );
			aliemu_team_member( "Rob Bryant, MD", "rob-bryant.png", "", "", "robjbryant13" );
			aliemu_team_member( "J. Scott Weiters, MD", "scott-weiters.png", "Director of Undergraduate Medical Education; Texas A&M EM Residency Program", "", "EMedCoach" );
			//- New Chiefs
			aliemu_team_member( "Michael Craddick, DO", "michael-craddick.png", "Chief Resident, University of Illinois COM at Peoria", "", "mdcraddick" );
			aliemu_team_member( "Jonathan Giordano, MD", "jonathan-giordano.png", "Chief Resident, Maimonides Medical Center", "", "jongioem" );
			aliemu_team_member( "George Hughes, MD", "george-hughes.png", "Chief Resident, University of Illinois at Chicago", "", "ghsmjm" );
			aliemu_team_member( "Travis Manasco, MD", "travis-manasco.png", "Chief Resident, Boston Medical Center (Boston University)", "", "EMphaticpause" );
			aliemu_team_member( "Sean McGann, MD", "sean-mcgann.png", "Chief Resident, Maimonides Medical Center", "", "seancmcgann" );
			aliemu_team_member( "Meg Pusateri, MD", "meg-pusateri.png", "Chief Resident, University of Louisville", "", "meg_pusateri" );
			aliemu_team_member( "Audrey Sanford, MD", $placeholder_img, "Chief Resident, University of Illinois at Chicago", "", "NCbornandbred" );
			aliemu_team_member( "Nana Sefa, MD", "nana-sefa.png", "Chief Resident, William Beaumont Hospital, Royal Oak", "", "nksefa" );
		?>
		</div>
	</main>
</section>
<?php

get_footer();
