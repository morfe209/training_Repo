<?php
	/**
	 * @package Show registered schools
	 * @version 1.0
	 */
	/*
	Plugin Name: Show registered schools
	Plugin URI: http://abtollc.com
	Description: View registered schools
	Armstrong: My Plugin.
	Author: Andrew Shakh
	Version: 1.0
	Author URI: http://abtollc.com
	*/

	add_shortcode('show-registered-schools', 'viewRegisteredSchools');

	add_action( 'init', 'wsr_init' );

	function wsr_init() {

		wp_register_script('wsr-sr-js', plugins_url('/js/wsr-js.js',__FILE__),array('jquery'));
		wp_enqueue_script('wsr-sr-js');
		wp_localize_script('wsr-sr-js', 'wsr', array(
			'ajaxurl' => admin_url( 'admin-ajax.php' )
		));
		wp_register_style('wsr-style', plugins_url('/css/wsr-style.css',__FILE__));
		wp_enqueue_style('wsr-style');
	}
	
	add_action('wp_ajax_nopriv_findschool', 'findSchool');
	add_action( 'wp_ajax_findschool', 'findSchool');
	
	add_action('wp_ajax_nopriv_gettown', 'fgettowns');
	add_action( 'wp_ajax_gettown', 'fgettowns');
	
	function fgettowns() {
		if (!empty($_POST['id'])) {
			global $wpdb;
			$r_id = $_POST['id'];
			$towns = $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_levenia_places WHERE regionId=%d ORDER BY name ASC;",$r_id));
			echo json_encode($towns);
		}
		exit();
	}
	
	add_action('wp_ajax_nopriv_getschool', 'fgetschools');
	add_action( 'wp_ajax_getschool', 'fgetschools');
	
	function fgetschools() {
		if (!empty($_POST['codeFrom']) && !empty($_POST['codeTo'])) {
			global $wpdb;
			$begin_code = (int) substr($_POST['codeFrom'],2);
			$region = (int) substr($_POST['codeFrom'], 0, 2);
			$end_code = (int) substr($_POST['codeTo'],2);
			$schools = $wpdb->get_results($wpdb->prepare("SELECT *  FROM wp_levenia_addresses WHERE CodeOfRegion=%d AND CodeOfPlace >= %d AND CodeOfPlace <= %d ORDER BY CodeOfPlace ASC;",$region,$begin_code,$end_code));
			if (!empty($schools)) {
				echo json_encode($schools);
			} else {
				echo 'nul';
			}
		}
		exit();
	}

	function viewRegisteredSchools(){
		global $wpdb;
		$regions = $wpdb->get_results("SELECT * FROM wp_levenia_region ORDER BY name ASC;");
		?>
		<div class="wsr-body">
			<div class="select-school">
			   <select name="wsr-regions" id="wsr-regions">
				   <option value="0">Виберіть область</option>
				   <?php	foreach ($regions as $region) { ?>
								<option value="<?php echo $region->id; ?>"><?php echo $region->name; ?></option>
				   <?php	} ?>
			   </select>
				<select name="wsr-town" id="wsr-town">
					<option value="0">Виберіть область</option>
				</select>
			</div>
			<div class="find-school">
				<label>Пошук школи за кодом:&nbsp&nbsp&nbsp&nbsp</label>
				<input type="text" name="code-school" id="find-code-school" value="" maxlength="5" size="4" />
				<input type="button" name="button-school" id="find-button-school" value="Знайти" />
			</div>
			<div style="clear:both;"></div>
			<div id="wsr-result-table">
				
			</div>
		</div>
<?php
	} 
	
	function findSchool() {
		if (!empty($_POST['code'])) {
			global $wpdb;
			$CodeOfPlace = (int) substr($_POST['code'],2);
			$region = (int) substr($_POST['code'], 0, 2);
			$school = $wpdb->get_row($wpdb->prepare("SELECT *  FROM wp_levenia_addresses WHERE CodeOfRegion=%d AND CodeOfPlace=%d;", $region, $CodeOfPlace));
			if (!empty($school)) {
				echo json_encode($school);
			} else {
				echo 'null';
			}
		}
		exit();
	}