// let selectedText = null;

window.addEventListener('load', () => {
	$(document.body).append($(`${TEMP_CONTENT}${TEMP_DIALOG}`))
})


//获取当前时间格式，格式如：周四 2024/08/23
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var week = date.getDay();
    var weekStr = "";
    switch (week) {
        case 0:
            weekStr = "周日";
            break;
        case 1:
            weekStr = "周一";
            break;
        case 2:
            weekStr = "周二";
            break;
        case 3:
            weekStr = "周三";
            break;
        case 4:
            weekStr = "周四";
            break;
        case 5:
            weekStr = "周五";
            break;
        case 6:
            weekStr = "周六";
            break;
    }
    return weekStr + " " + currentdate;
}


function formatDateToChinese(date) {  
	const chineseNumbers = ['零', '壹', '贰', '叁', '肆',  '伍', '陆',  '柒', '捌', '玖',];  
	const chineseMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];  
		
	// 辅助函数：将数字转换为中文数字（仅处理个位和十位）  
	function toChineseNumber(str) {
		let res = ''
			for (let i = 0 ; i < str.length; i++) {
				res = `${res}${chineseNumbers[str[i]]}`
			}
			return res
	}

	// 格式化年份和月份  
	const year = date.getFullYear();  
	const yearStr = toChineseNumber(year.toString());
	const month = date.getMonth(); // 注意getMonth返回的是0-11，所以需要+1  
	const monthStr = chineseMonths[month];
	let strDate = date.getDate();
	if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
	}
	return [`${yearStr}年`, monthStr, strDate];  
} 

// 示例用法  
const date = new Date();  
console.log(formatDateToChinese(date)); // 输出类似 "贰零贰肆年 十二月" 的结果（取决于当前日期）

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	console.log('request--', request);
	const { action, data } = request || {}
	const dateStr = getNowFormatDate()
	if ( action === 'saysnap-theme-default') {
		$('.say-snap-r7-text-cp').text(data)
		$('.say-snap-r7-date-cp').text(dateStr)
		handleGenerate(document.getElementById('say-snap-r7-card-cp'), $('.say-snap-r7-content-main-cp'))
	} else if (action === 'saysnap-theme-blue') {
		$('.say-snap-r7-text').text(data)
		$('.say-snap-r7-date').text(dateStr)
		handleGenerate(document.getElementById('say-snap-r7-card-cp-2'), $('.say-snap-r7-content-main-cp'))
	} else if (action === 'saysnap-theme-mark') {
		const [year, month, strDate] = formatDateToChinese(new Date())
		$('.say-snap-r7-date-show').text(strDate)
		$('.say-snap-r7-month-show').text(month)
		$('.say-snap-r7-year-show').text(year)
		$('.say-snap-r7-card-3-content').text(data)
		handleGenerate(document.getElementById('say-snap-r7-card-cp-3'), $('.say-snap-r7-content-main-cp'))
	}
	sendResponse({ status: true})
});

function hideToast(text, delay = 3000) {
	$('.say-snap-r7-dialog-cp').text(text).show()
	setTimeout(() => {
		$('.say-snap-r7-dialog-cp').hide()
	}, delay);
}

function handleGenerate(domNode, parentNode) {
	parentNode.show()
	$('.say-snap-r7-dialog').text(' 👉generating').show()
	setTimeout(() => {
		domtoimage.toBlob(domNode)
		.then(function (blob) {
			console.log('ClipboardItem blob--', blob)
			const item = new ClipboardItem({ "image/png": blob });  
				navigator.clipboard.write([item]).then(function() {  
								hideToast('👌 Ctrl + V', 3000)
								parentNode.hide()
						}, function(err) {  
								hideToast('Failed', 3000)
								parentNode.hide()
						}); 
		})
		.catch((err) => {
			hideToast('Failed', 3000)
		})
	}, 1000)
}

// document.addEventListener('selectionchange', function() {  
// 	if (window.getSelection) {  
// 			selectedText = window.getSelection().toString();  
// 	} else if (document.selection && document.selection.createRange) {  
// 			selectedText = document.selection.createRange().text;  
// 	}
// 	// 打印选中的文本  
// 	console.log('选中的文本:', selectedText);  
// });