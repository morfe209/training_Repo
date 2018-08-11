<?php
/**
 * @package Show results schools
 * @version 1.0
 */
/*
  Plugin Name: Show results schools
  Plugin URI: http://abtollc.com
  Description: View results schools
  Armstrong: My Plugin.
  Author: Andrew Shakh
  Version: 1.0
  Author URI: http://abtollc.com
 */

register_activation_hook(__FILE__, array('ShowResult', 'install'));
register_deactivation_hook(__FILE__, array('ShowResult', 'uninstall'));

add_action('init', 'wsr_res_init');

function wsr_res_init() {
    $show_this_plugin = ShowResult::getInstance();
}

require_once dirname(__FILE__) . '/common.php';

class ShowResult {

    private static $Instance;

    private function __construct() {
        add_shortcode('show-results-schools', array($this, 'viewResultsSchools'));
        add_action('wp_ajax_nopriv_getrestown', array($this, 'getTowns'));
        add_action('wp_ajax_getrestown', array($this, 'getTowns'));
        add_action('wp_ajax_nopriv_getresschool', array($this, 'getSchools'));
        add_action('wp_ajax_getresschool', array($this, 'getSchools'));
        add_action('wp_ajax_nopriv_getpupils', array($this, 'viewPupils'));
        add_action('wp_ajax_getpupils', array($this, 'viewPupils'));
        add_action('wp_ajax_nopriv_getpupilanswers', array($this, 'viewPupilAnswers'));
        add_action('wp_ajax_getpupilanswers', array($this, 'viewPupilAnswers'));
        add_action('wp_ajax_nopriv_findschoolres', array($this, 'findSchools'));
        add_action('wp_ajax_findschoolres', array($this, 'findSchools'));
        add_action('wp_ajax_nopriv_getpupilssort', array($this, 'viewPupilsSort'));
        add_action('wp_ajax_getpupilssort', array($this, 'viewPupilsSort'));

        add_action('wp_ajax_nopriv_getstats', array($this, 'getStats'));
        add_action('wp_ajax_getstats', array($this, 'getStats'));

        add_action('admin_menu', array($this, 'showAdminPage'));
        if (get_option('wsr-res-on-off')) {
            wp_register_script('wsr-res-js', plugins_url('/js/wsr-res-js.js', __FILE__), array('jquery'));
            wp_enqueue_script('wsr-res-js');
            wp_localize_script('wsr-res-js', 'wsr', array(
                'ajaxurl' => admin_url('admin-ajax.php')
            ));
            wp_register_script('jquery-ui', plugins_url('/js/jquery-ui-1.9.0.custom.min.js', __FILE__), array('jquery'));
            wp_enqueue_script('jquery-ui');
            wp_register_style('wsr-res-style', plugins_url('/css/wsr-res-style.css', __FILE__));
            wp_enqueue_style('wsr-res-style');
            wp_register_style('jquery-ui-style', plugins_url('/css/jquery-ui-1.9.0.custom.min.css', __FILE__));
            wp_enqueue_style('jquery-ui-style');
        }

        $this->pupilsHelper = new PupilsHelper();
    }

    static function getInstance() {
        if (!self::$Instance) {
            self::$Instance = new ShowResult();
        }

        return self::$Instance;
    }

    static function install() {
        if (!get_option('wsr-res-on-off')) {
            add_option('wsr-res-on-off', 1);
        }
        if (!get_option('wsr-res-marks')) {
            $marks['6']['best'] = 104;
            $marks['6']['good'] = 67;
            $marks['7']['best'] = 104;
            $marks['7']['good'] = 67;
            $marks['8']['best'] = 104;
            $marks['8']['good'] = 67;
            $marks['9']['best'] = 104;
            $marks['9']['good'] = 67;
            $marks['9s']['best'] = 104;
            $marks['9s']['good'] = 67;
            $marks['10']['best'] = 104;
            $marks['10']['good'] = 67;
            $marks['10s']['best'] = 104;
            $marks['10s']['good'] = 67;
            $marks['11']['best'] = 104;
            $marks['11']['good'] = 67;
            $marks['11s']['best'] = 104;
            $marks['11s']['good'] = 67;
            add_option('wsr-res-marks', $marks);
        }
    }

    static function uninstall() {
        if (get_option('wsr-res-on-off')) {
            delete_option('wsr-res-on-off');
        }
        if (get_option('wsr-res-marks')) {
            delete_option('wsr-res-marks');
        }
    }

    public function viewResultsSchools() {
        if (get_option('wsr-res-on-off')) {
            global $wpdb;
            $regions = $wpdb->get_results("SELECT * FROM wp_levenia_region ORDER BY name ASC;");
            ?>
            <div class="wsr-body">
                <div class="select-school-res">
                    <div id="wsr-res-regions-wrap">
                        <select name="wsr-res-regions" id="wsr-res-regions">
                            <option value="0" >Виберіть область</option>
                            <?php foreach ($regions as $region) { ?>
                                <option value="<?php echo $region->id; ?>"><?php echo $region->name; ?></option>
                            <?php } ?>
                        </select>
                        <span id="region-stats" class="stats-button"></span>
                    </div>

                    <div id="wsr-res-town-wrap">
                        <select name="wsr-res-town" id="wsr-res-town">
                            <option value="0" selected="selected">Виберіть область</option>
                        </select>
                        <span id="city-stats" class="stats-button"></span>
                    </div>
                </div>
                <div class="find-school-res">
                    <label>Пошук школи за кодом:&nbsp&nbsp&nbsp&nbsp</label>
                    <input type="text" name="code-school" id="find-code-school-res" value="" maxlength="5" size="4" />
                    <input type="button" name="button-school" id="find-button-school-res" value="Знайти" />
                </div>
                <div style="clear:both;"></div>
                <div id="wsr-result-table">

                </div>
                <div id="pupil-dialog" style="display:none;" title=""></div>
            </div>
            <?php
        } else {
            echo "<h2>Результати за поточний рік ще неготові</h2>";
        }
    }

    public function getTowns() {
        if (!empty($_POST['id'])) {
            global $wpdb;
            $r_id = $_POST['id'];
            $towns = $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_levenia_places WHERE regionId=%d ORDER BY name ASC;", $r_id));
            echo json_encode($towns);
        }
        exit();
    }

    public function getSchools() {
        if (!empty($_POST['codeFrom']) && !empty($_POST['codeTo'])) {
            global $wpdb;
            $begin_code = (int) substr($_POST['codeFrom'], 2);
            $region = (int) substr($_POST['codeFrom'], 0, 2);
            $end_code = (int) substr($_POST['codeTo'], 2);
            $schools = $wpdb->get_results($wpdb->prepare("SELECT *  FROM wp_levenia_addresses 
                    WHERE CodeOfRegion=%d AND CodeOfPlace >= %d AND CodeOfPlace <= %d ORDER BY CodeOfPlace ASC;", $region, $begin_code, $end_code));
            if (!empty($schools)) {
                echo json_encode($schools);
            } else {
                echo 'null';
            }
        }
        exit();
    }

    public function viewPupils() {
        if (!empty($_POST['codeOfFile'])) {
            $pupils = $this->pupilsHelper->getPupils($_POST['codeOfFile']);
            if (!empty($pupils)) {
                foreach ($pupils as &$pupil) {
                    $pupil['score'] = $this->pupilsHelper->calculateScores($pupil['answers'], $pupil['class']);
                    $pupil['mark'] = $this->pupilsHelper->calculateMark($pupil['score'], $pupil['class']);
                    unset($pupil['answers']);
                }

                function pppsort($a, $b) {
                    $orderBy = array('class' => 'asc', 'score' => 'desc');
                    $result = 0;
                    foreach ($orderBy as $key => $value) {
                        if ($a[$key] == $b[$key])
                            continue;
                        $result = ($a[$key] < $b[$key]) ? -1 : 1;
                        if ($value == 'desc')
                            $result = -$result;
                        break;
                    }
                    return $result;
                }

                usort($pupils, "pppsort");
                echo json_encode($pupils);
            } else {
                echo 'null';
            }
        }
        exit();
    }

    public function viewPupilsSort() {
        if (!empty($_POST['codeOfFile'])) {
            $pupils = $this->pupilsHelper->getPupils($_POST['codeOfFile']);

            if (!empty($pupils)) {
                foreach ($pupils as &$pupil) {
                    $pupil['score'] = $this->pupilsHelper->calculateScores($pupil['answers'], $pupil['class']);
                    $pupil['mark'] = $this->pupilsHelper->calculateMark($pupil['score'], $pupil['class']);
                    unset($pupil['answers']);
                }

                function pppsort2($a, $b) {

                    $orderkey = $_POST['orderby'];
                    /* if ($orderkey === 'class' || $orderkey === 'score') {
                      $orderBy=array('class'=>'asc', 'score'=>'desc');
                      } else {
                      $orderBy=array($orderkey=>'asc');
                      }
                      $result= 0;
                      foreach( $orderBy as $key => $value ) {
                      if( $a[$key] == $b[$key] ) continue;
                      $result= ($a[$key] < $b[$key])? -1 : 1;
                      if( $value=='desc' ) $result= -$result;
                      break;
                      } */
                    if (in_array($orderkey, array('mark', 'id', 'pib', 'class', 'score'))) {
                        if ($orderkey == 'class') {
                            $a[$orderkey] = ($a[$orderkey][0] == 1) ? $a[$orderkey] : '0' . $a[$orderkey];
                            $b[$orderkey] = ($b[$orderkey][0] == 1) ? $b[$orderkey] : '0' . $b[$orderkey];
                        }
                        if ($a[$orderkey] < $b[$orderkey])
                            return -1;
                        if ($a[$orderkey] > $b[$orderkey])
                            return 1;
                        return 0;
                    }
                    return 0;
                }

                usort($pupils, "pppsort2");

                echo json_encode($pupils);
            } else {
                echo 'null';
            }
        }
        exit();
    }

    public function viewPupilAnswers() {
        if (!empty($_POST['codeOfPupil'])) {
            $codeOfPupil = $_POST['codeOfPupil'];
            $codeOfFile = $_POST['codeOfFile'];
            $nameOfPupil = $_POST['nameOfPupil'];
            echo json_encode($this->getPupil($codeOfFile, $codeOfPupil, $nameOfPupil));
        }
        exit();
    }

    private function getPupil($codeOfFile, $codeOfPupil, $nameOfPupil) {
        $pupils = $this->pupilsHelper->getPupils($codeOfFile);
        //if (!empty($pupils))  {
        $out = array();
        foreach ($pupils as $pupil) {
            if ($codeOfPupil === $pupil['id'] && $pupil['pib'] === $nameOfPupil) {
                $out['score'] = $this->pupilsHelper->calculateScores($pupil['answers'], $pupil['class']);
                $out['mark'] = $this->pupilsHelper->calculateMark($out['score'], $pupil['class']);
                $out['id'] = $pupil['id'];
                $out['pib'] = $pupil['pib'];
                $out['class'] = $pupil['class'];
                $out['class_display'] = $pupil['class'] == '10s' ? '10ф' : $pupil['class'];
                $out['class_display'] = $pupil['class'] == '11s' ? '11ф' : $pupil['class'];
                $out['class_display'] = $pupil['class'] == '9s' ? '9ф' : $pupil['class'];
                $out['answers'] = $pupil['answers'];
                break;
            }
        }
        //$class = ($out['class'] == '10ф')?'10s':$out['class'];
        //$class = ($out['class'] == '11ф')?'11s':$out['class'];
        $out['answers'] = $this->createTableResul($out['answers'], $out['class']);
        //}
        return $out;
    }

    private function createTableResul($pupilAnswers, $class) {
        $correctAnswers = $this->pupilsHelper->getAnswersForGrades($class);
        $out = array();
        $task = 1;
        //if(!empty($correctAnswers))
        foreach ($correctAnswers as $indexAnswer => $answer) {
            if ($task > 10) {
                $task = 1;
            }

            if ($answer === $pupilAnswers[$indexAnswer] && $answer !== '00000') {
                if ($indexAnswer < 10) {
                    $out['1'][$task]['correctly'] = 1;
                    $out['1'][$task]['corect_num'] = $this->getNumAnswer($answer);
                    $out['1'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                    $out['1'][$task]['current_mark'] = 3;
                } else if ($indexAnswer < 20) {
                    $out['2'][$task]['correctly'] = 1;
                    $out['2'][$task]['corect_num'] = $this->getNumAnswer($answer);
                    $out['2'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                    $out['2'][$task]['current_mark'] = 4;
                } else if ($indexAnswer < 30) {
                    $out['3'][$task]['correctly'] = 1;
                    $out['3'][$task]['corect_num'] = $this->getNumAnswer($answer);
                    $out['3'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                    $out['3'][$task]['current_mark'] = 5;
                }
            } else {
                if ($pupilAnswers[$indexAnswer] === '00000') {
                    if ($indexAnswer < 10) {
                        $out['1'][$task]['correctly'] = 0;
                        $out['1'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['1'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['1'][$task]['current_mark'] = 0;
                    } else if ($indexAnswer < 20) {
                        $out['2'][$task]['correctly'] = 0;
                        $out['2'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['2'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['2'][$task]['current_mark'] = 0;
                    } else if ($indexAnswer < 30) {
                        $out['3'][$task]['correctly'] = 0;
                        $out['3'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['3'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['3'][$task]['current_mark'] = 0;
                    }
                } else {
                    if ($indexAnswer < 10) {
                        $out['1'][$task]['correctly'] = 0;
                        $out['1'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['1'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['1'][$task]['current_mark'] = -0.75;
                    } else if ($indexAnswer < 20) {
                        $out['2'][$task]['correctly'] = 0;
                        $out['2'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['2'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['2'][$task]['current_mark'] = -1;
                    } else if ($indexAnswer < 30) {
                        $out['3'][$task]['correctly'] = 0;
                        $out['3'][$task]['corect_num'] = $this->getNumAnswer($answer);
                        $out['3'][$task]['pupil_num'] = $this->getNumAnswer($pupilAnswers[$indexAnswer]);
                        $out['3'][$task]['current_mark'] = -1.25;
                    }
                }
            }
            $task++;
        }
        return $out;
    }

    private function getNumAnswer($strAnswer) {
        if ($strAnswer !== '00000') {
            for ($i = 0; $i < strlen($strAnswer); $i++) {
                if ($strAnswer[$i] === '1') {
                    return $i + 1;
                }
            }
        } else {
            return 0;
        }
    }

    public function showAdminPage() {
        add_options_page('Результати за рік', 'Результати за рік', 9, 'wp-show-results', array($this, 'getOptionsPage'));
    }

    public function getOptionsPage() {
        if (!empty($_POST['wsr-submit'])) {
            if (isset($_POST['wsr-res-on-off'])) {
                update_option("wsr-res-on-off", 1);
            } else {
                update_option("wsr-res-on-off", 0);
            }
            $marks = get_option('wsr-res-marks');
            $i = 0;
            foreach ($marks as &$mark) {
                $mark['best'] = $_POST['best'][$i];
                $mark['good'] = $_POST['good'][$i];
                $i++;
            }
            update_option("wsr-res-marks", $marks);
        }
        $option = get_option('wsr-res-on-off');
        $checked = '';
        if ($option) {
            $checked = 'checked="checked"';
        }
        $marks = get_option('wsr-res-marks');
        ?>
        <h2>Результати за поточний рік</h2><hr/>
        <form method="POST" name="wsr-res-option" action="<?php echo $_SERVER['PHP_SELF']; ?>?page=wp-show-results">
            <label>Відображати результати за поточний рік: </label>
            <input type="checkbox" name="wsr-res-on-off" value="<?php echo $option; ?>" <?php echo $checked; ?> /><br/><br/>
            <h2>Правила визнечення “результату”</h2><hr/>
            <table border="0">
                <tr>
                    <th></th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                    <th>9ф</th>
                    <th>10</th>
                    <th>10ф</th>
                    <th>11</th>
                    <th>11ф</th>
                </tr>
                <tr>
                    <th>Відмінно</th>
                    <?php foreach ($marks as $class => $mark) { ?>
                        <th><input name="best[]" value="<?php echo $mark['best']; ?>"  size="2" /></th>
                    <?php } ?>
                </tr>
                <tr>
                    <th>Добре</th>
                    <?php foreach ($marks as $class => $mark) { ?>
                        <th><input name="good[]" value="<?php echo $mark['good']; ?>" size="2" /></th>
                    <?php } ?>
                </tr>
            </table><br/><br/>
            <input type="submit" name="wsr-submit" value="Зберегти налаштування" />
        </form>
        <?php
    }

    public function findSchools() {
        if (!empty($_POST['code'])) {
            global $wpdb;
            $CodeOfPlace = (int) substr($_POST['code'], 2);
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

    private function getRegionSchoolCodes($regionId) {
        global $wpdb;
        $sql = $wpdb->prepare("
            SELECT concat(s.CodeOfRegion, s.CodeOfPlace) as code
            FROM wp_levenia_places c
                JOIN wp_levenia_addresses s 
                    ON (s.CodeOfRegion = CAST(SUBSTRING(c.codeFrom, 1, 2) AS UNSIGNED) 
                        AND s.CodeOfPlace >= CAST(SUBSTRING(c.codeFrom, 3) AS UNSIGNED) 
                        AND s.CodeOfPlace <= CAST(SUBSTRING(c.codeTo, 3) AS UNSIGNED))                            
            where c.regionId = %d", $regionId);
        $schools = $wpdb->get_results($sql);
        return $schools;
    }

    private function printStatsByRegion($region) {
        global $wpdb;
        $items = $this->getRegionSchoolCodes($region);
        $codes = array();
        foreach ($items as $item) {
            $codes[(int) $item->code] = 0;
        }
        $items = $wpdb->get_results("SELECT * FROM wp_levenia_stats WHERE `year` = YEAR(CURDATE())");
        $stats = array();
        foreach ($items as $item) {
            $stats[(int) $item->index] = $item;
        }
        $stats = array_intersect_key($stats, $codes);
        $totalA = 0;
        $totalB = 0;
        $totalC = 0;
        foreach ($stats as $item) {
            $totalA += $item->a_score_total;
            $totalB += $item->b_score_total;
            $totalC += $item->c_score_total;
        }
        echo json_encode(array(
            'a_score_total' => $totalA,
            'b_score_total' => $totalB,
            'c_score_total' => $totalC
                )
        );
    }

    private function printStatsByCity($city) {
        global $wpdb;
        $sql = $wpdb->prepare("
            SELECT SUM(st.a_score_total) as a_score_total, 
                SUM(st.b_score_total) as b_score_total,
                SUM(st.c_score_total) as c_score_total
            FROM wp_levenia_places c
                JOIN wp_levenia_addresses s 
                    ON (s.CodeOfRegion = CAST(SUBSTRING(c.codeFrom, 1, 2) AS UNSIGNED) 
                        AND s.CodeOfPlace >= CAST(SUBSTRING(c.codeFrom, 3) AS UNSIGNED) 
                        AND s.CodeOfPlace <= CAST(SUBSTRING(c.codeTo, 3) AS UNSIGNED))                            
                JOIN wp_levenia_stats st ON (st.year = YEAR(CURDATE())) AND (CAST(st.index AS UNSIGNED) = CAST(CONCAT(s.CodeOfRegion, s.CodeOfPlace) AS UNSIGNED))
            where c.id = %d
            GROUP BY c.id", $city);
        $totals = $wpdb->get_results($sql);
        echo json_encode($totals[0]);
    }

    public function getStats() {
        global $wpdb;

        $region = $_REQUEST['region'];
        $city = $_REQUEST['city'];
        $schoolCode = $_REQUEST['schoolCode'];

        if ($schoolCode) {
            $this->pupilsHelper->updateStats($schoolCode);
            $totals = $wpdb->get_results(
                    $wpdb->prepare(
                            "SELECT a_score_total, b_score_total, c_score_total
                             FROM wp_levenia_stats WHERE `index` = %d AND `year` = YEAR(CURDATE())", $schoolCode
            ));
            echo json_encode($totals[0]);
        } elseif ($city) {
            $this->printStatsByCity($city);
        } elseif ($region) {
            $this->printStatsByRegion($region);
        }
        exit();
    }

}

