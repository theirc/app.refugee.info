export function capitalize(string) {
    return string[0].toLocaleUpperCase() + string.slice(1);
}


let countryFlags = {
    'af': require('../assets/flags/af.png'),
    'al': require('../assets/flags/al.png'),
    'dz': require('../assets/flags/dz.png'),
    'as': require('../assets/flags/as.png'),
    'ad': require('../assets/flags/ad.png'),
    'ao': require('../assets/flags/ao.png'),
    'ai': require('../assets/flags/ai.png'),
    'aq': require('../assets/flags/aq.png'),
    'ag': require('../assets/flags/ag.png'),
    'ar': require('../assets/flags/ar.png'),
    'am': require('../assets/flags/am.png'),
    'aw': require('../assets/flags/aw.png'),
    'au': require('../assets/flags/au.png'),
    'at': require('../assets/flags/at.png'),
    'az': require('../assets/flags/az.png'),
    'bs': require('../assets/flags/bs.png'),
    'bh': require('../assets/flags/bh.png'),
    'bd': require('../assets/flags/bd.png'),
    'bb': require('../assets/flags/bb.png'),
    'by': require('../assets/flags/by.png'),
    'be': require('../assets/flags/be.png'),
    'bz': require('../assets/flags/bz.png'),
    'bj': require('../assets/flags/bj.png'),
    'bm': require('../assets/flags/bm.png'),
    'bt': require('../assets/flags/bt.png'),
    'bo': require('../assets/flags/bo.png'),
    'ba': require('../assets/flags/ba.png'),
    'bw': require('../assets/flags/bw.png'),
    'br': require('../assets/flags/br.png'),
    'bn': require('../assets/flags/bn.png'),
    'bg': require('../assets/flags/bg.png'),
    'bf': require('../assets/flags/bf.png'),
    'bi': require('../assets/flags/bi.png'),
    'kh': require('../assets/flags/kh.png'),
    'cm': require('../assets/flags/cm.png'),
    'ca': require('../assets/flags/ca.png'),
    'cv': require('../assets/flags/cv.png'),
    'ky': require('../assets/flags/ky.png'),
    'cf': require('../assets/flags/cf.png'),
    'td': require('../assets/flags/td.png'),
    'cl': require('../assets/flags/cl.png'),
    'cn': require('../assets/flags/cn.png'),
    'co': require('../assets/flags/co.png'),
    'km': require('../assets/flags/km.png'),
    'cg': require('../assets/flags/cg.png'),
    'cd': require('../assets/flags/cd.png'),
    'ck': require('../assets/flags/ck.png'),
    'cr': require('../assets/flags/cr.png'),
    'ci': require('../assets/flags/ci.png'),
    'hr': require('../assets/flags/hr.png'),
    'cu': require('../assets/flags/cu.png'),
    'cy': require('../assets/flags/cy.png'),
    'cz': require('../assets/flags/cz.png'),
    'dk': require('../assets/flags/dk.png'),
    'dj': require('../assets/flags/dj.png'),
    'dm': require('../assets/flags/dm.png'),
    'do': require('../assets/flags/do.png'),
    'ec': require('../assets/flags/ec.png'),
    'eg': require('../assets/flags/eg.png'),
    'sv': require('../assets/flags/sv.png'),
    'gq': require('../assets/flags/gq.png'),
    'ee': require('../assets/flags/ee.png'),
    'et': require('../assets/flags/et.png'),
    'fo': require('../assets/flags/fo.png'),
    'fj': require('../assets/flags/fj.png'),
    'fi': require('../assets/flags/fi.png'),
    'fr': require('../assets/flags/fr.png'),
    'pf': require('../assets/flags/pf.png'),
    'ga': require('../assets/flags/ga.png'),
    'gm': require('../assets/flags/gm.png'),
    'ge': require('../assets/flags/ge.png'),
    'de': require('../assets/flags/de.png'),
    'gh': require('../assets/flags/gh.png'),
    'gi': require('../assets/flags/gi.png'),
    'gr': require('../assets/flags/gr.png'),
    'gl': require('../assets/flags/gl.png'),
    'gd': require('../assets/flags/gd.png'),
    'gp': require('../assets/flags/gp.png'),
    'gu': require('../assets/flags/gu.png'),
    'gt': require('../assets/flags/gt.png'),
    'gg': require('../assets/flags/gg.png'),
    'gn': require('../assets/flags/gn.png'),
    'gw': require('../assets/flags/gw.png'),
    'gy': require('../assets/flags/gy.png'),
    'ht': require('../assets/flags/ht.png'),
    'va': require('../assets/flags/va.png'),
    'hn': require('../assets/flags/hn.png'),
    'hk': require('../assets/flags/hk.png'),
    'hu': require('../assets/flags/hu.png'),
    'is': require('../assets/flags/is.png'),
    'in': require('../assets/flags/in.png'),
    'id': require('../assets/flags/id.png'),
    'ir': require('../assets/flags/ir.png'),
    'iq': require('../assets/flags/iq.png'),
    'ie': require('../assets/flags/ie.png'),
    'im': require('../assets/flags/im.png'),
    'il': require('../assets/flags/il.png'),
    'it': require('../assets/flags/it.png'),
    'jm': require('../assets/flags/jm.png'),
    'jp': require('../assets/flags/jp.png'),
    'je': require('../assets/flags/je.png'),
    'jo': require('../assets/flags/jo.png'),
    'kz': require('../assets/flags/kz.png'),
    'ke': require('../assets/flags/ke.png'),
    'ki': require('../assets/flags/ki.png'),
    'kr': require('../assets/flags/kr.png'),
    'kw': require('../assets/flags/kw.png'),
    'kg': require('../assets/flags/kg.png'),
    'la': require('../assets/flags/la.png'),
    'lv': require('../assets/flags/lv.png'),
    'lb': require('../assets/flags/lb.png'),
    'ls': require('../assets/flags/ls.png'),
    'lr': require('../assets/flags/lr.png'),
    'ly': require('../assets/flags/ly.png'),
    'li': require('../assets/flags/li.png'),
    'lt': require('../assets/flags/lt.png'),
    'lu': require('../assets/flags/lu.png'),
    'mo': require('../assets/flags/mo.png'),
    'mk': require('../assets/flags/mk.png'),
    'mg': require('../assets/flags/mg.png'),
    'mw': require('../assets/flags/mw.png'),
    'my': require('../assets/flags/my.png'),
    'mv': require('../assets/flags/mv.png'),
    'ml': require('../assets/flags/ml.png'),
    'mt': require('../assets/flags/mt.png'),
    'mh': require('../assets/flags/mh.png'),
    'mq': require('../assets/flags/mq.png'),
    'mr': require('../assets/flags/mr.png'),
    'mu': require('../assets/flags/mu.png'),
    'mx': require('../assets/flags/mx.png'),
    'fm': require('../assets/flags/fm.png'),
    'md': require('../assets/flags/md.png'),
    'mc': require('../assets/flags/mc.png'),
    'mn': require('../assets/flags/mn.png'),
    'me': require('../assets/flags/me.png'),
    'ms': require('../assets/flags/ms.png'),
    'ma': require('../assets/flags/ma.png'),
    'mz': require('../assets/flags/mz.png'),
    'mm': require('../assets/flags/mm.png'),
    'na': require('../assets/flags/na.png'),
    'nr': require('../assets/flags/nr.png'),
    'np': require('../assets/flags/np.png'),
    'nl': require('../assets/flags/nl.png'),
    'an': require('../assets/flags/an.png'),
    'nc': require('../assets/flags/nc.png'),
    'nz': require('../assets/flags/nz.png'),
    'ni': require('../assets/flags/ni.png'),
    'ne': require('../assets/flags/ne.png'),
    'ng': require('../assets/flags/ng.png'),
    'no': require('../assets/flags/no.png'),
    'om': require('../assets/flags/om.png'),
    'pk': require('../assets/flags/pk.png'),
    'pw': require('../assets/flags/pw.png'),
    'ps': require('../assets/flags/ps.png'),
    'pa': require('../assets/flags/pa.png'),
    'pg': require('../assets/flags/pg.png'),
    'py': require('../assets/flags/py.png'),
    'pe': require('../assets/flags/pe.png'),
    'ph': require('../assets/flags/ph.png'),
    'pl': require('../assets/flags/pl.png'),
    'pt': require('../assets/flags/pt.png'),
    'pr': require('../assets/flags/pr.png'),
    'qa': require('../assets/flags/qa.png'),
    're': require('../assets/flags/re.png'),
    'ro': require('../assets/flags/ro.png'),
    'ru': require('../assets/flags/ru.png'),
    'rw': require('../assets/flags/rw.png'),
    'kn': require('../assets/flags/kn.png'),
    'lc': require('../assets/flags/lc.png'),
    'vc': require('../assets/flags/vc.png'),
    'ws': require('../assets/flags/ws.png'),
    'sm': require('../assets/flags/sm.png'),
    'st': require('../assets/flags/st.png'),
    'sa': require('../assets/flags/sa.png'),
    'sn': require('../assets/flags/sn.png'),
    'rs': require('../assets/flags/rs.png'),
    'sc': require('../assets/flags/sc.png'),
    'sl': require('../assets/flags/sl.png'),
    'sg': require('../assets/flags/sg.png'),
    'sk': require('../assets/flags/sk.png'),
    'si': require('../assets/flags/si.png'),
    'sb': require('../assets/flags/sb.png'),
    'so': require('../assets/flags/so.png'),
    'za': require('../assets/flags/za.png'),
    'es': require('../assets/flags/es.png'),
    'lk': require('../assets/flags/lk.png'),
    'sd': require('../assets/flags/sd.png'),
    'sr': require('../assets/flags/sr.png'),
    'sz': require('../assets/flags/sz.png'),
    'se': require('../assets/flags/se.png'),
    'ch': require('../assets/flags/ch.png'),
    'sy': require('../assets/flags/sy.png'),
    'tw': require('../assets/flags/tw.png'),
    'tj': require('../assets/flags/tj.png'),
    'tz': require('../assets/flags/tz.png'),
    'th': require('../assets/flags/th.png'),
    'tl': require('../assets/flags/tl.png'),
    'tg': require('../assets/flags/tg.png'),
    'to': require('../assets/flags/to.png'),
    'tt': require('../assets/flags/tt.png'),
    'tn': require('../assets/flags/tn.png'),
    'tr': require('../assets/flags/tr.png'),
    'tm': require('../assets/flags/tm.png'),
    'tc': require('../assets/flags/tc.png'),
    'tv': require('../assets/flags/tv.png'),
    'ug': require('../assets/flags/ug.png'),
    'ua': require('../assets/flags/ua.png'),
    'ae': require('../assets/flags/ae.png'),
    'gb': require('../assets/flags/gb.png'),
    'us': require('../assets/flags/us.png'),
    'uy': require('../assets/flags/uy.png'),
    'uz': require('../assets/flags/uz.png'),
    'vu': require('../assets/flags/vu.png'),
    've': require('../assets/flags/ve.png'),
    'vn': require('../assets/flags/vn.png'),
    'vg': require('../assets/flags/vg.png'),
    'vi': require('../assets/flags/vi.png'),
    'eh': require('../assets/flags/eh.png'),
    'ye': require('../assets/flags/ye.png'),
    'zm': require('../assets/flags/zm.png'),
    'zw': require('../assets/flags/zw.png')
};

export function getCountryFlag(countryISO) {
    let lowerCaseCountryISO = countryISO.toLowerCase();

    if (countryFlags.hasOwnProperty(lowerCaseCountryISO)) {
        return countryFlags[lowerCaseCountryISO];
    }
}

export function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : '';

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i=0; i<arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                paramNum = v.slice(1,-1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1])==='undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}