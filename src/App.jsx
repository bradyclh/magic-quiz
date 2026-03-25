import { useState, useEffect, useMemo } from "react";

const fullQuestionBank = [
  { id: 1, q: "下列選項「」中的注音寫成國字後，哪一組前後相同？", opts: ["(A) 「ㄒㄧ」蟀鳴唱／「ㄒㄧ」蜴爬樹", "(B) 「ㄗㄞˋ」舟覆舟／車「ㄗㄞˋ」斗量", "(C) 傷口化「ㄋㄨㄥˊ」／蜂蜜「ㄋㄨㄥˊ」稠", "(D) 不虞「ㄎㄨㄟˋ」乏／「ㄎㄨㄟˋ」不成軍"], ans: "B", exp: "(A) 蟋／蜥。(B) 載／載。(C) 膿／濃。(D) 匱／潰。" },
  { id: 2, q: "下列各組「」中注音寫成國字後，何者兩兩相同？", opts: ["(A) 不「ㄩˊ」匱乏／行有「ㄩˊ」力", "(B) 「ㄍㄨㄟ」勸好友／墨守成「ㄍㄨㄟ」", "(C) 紅著眼「ㄎㄨㄤ」／兩「ㄎㄨㄤ」蘿蔔", "(D) 「ㄎㄨㄛˋ」大營業／店面寬「ㄎㄨㄛˋ」"], ans: "B", exp: "(A) 虞／餘。(B) 規／規。(C) 眶／筐。(D) 擴／闊。" },
  { id: 3, q: "下列選項「」中的注音寫成國字後，哪一組前後相同？", opts: ["(A) 「ㄒㄧ」蜂鳴唱／「ㄒㄧ」蜴爬樹", "(B) 「ㄗㄞˋ」舟覆舟／車「ㄗㄞˋ」斗量", "(C) 傷口化「ㄋㄨㄥˊ」／蜂蜜「ㄋㄨㄥˊ」稠", "(D) 不虞「ㄎㄨㄟˋ」乏／「ㄎㄨㄟˋ」不成軍"], ans: "B", exp: "(A) 蟋(或蜂)／蜥。(B) 載／載。(C) 膿／濃。(D) 匱／潰。" },
  { id: 4, q: "下列選項「」中的注音寫成國字後，哪一組字形前後相同？", opts: ["(A) 口「ㄅㄟ」載道／「ㄅㄟ」劣手段", "(B) 憑空「ㄧˋ」測／追「ㄧˋ」往事", "(C) 窮鄉僻「ㄖㄤˇ」／天「ㄖㄤˇ」之別", "(D) 無所忌「ㄉㄢˋ」／「ㄉㄢˋ」盡糧絕"], ans: "C", exp: "(A) 碑／卑。(B) 臆／憶。(C) 壤／壤。(D) 憚／殫。" },
  { id: 5, q: "下列選項「」中的注音寫成國字後，哪一組字形前後相同？", opts: ["(A) 執迷不「ㄨˋ」／會「ㄨˋ」官員", "(B) 商店打「ㄧㄤˊ」／熱情「ㄧㄤˊ」溢", "(C) 「ㄐㄧㄠˇ」盡腦汁／強詞「ㄐㄧㄠˇ」辯", "(D) 「ㄌㄧㄣˊ」漓盡致／狗血「ㄌㄧㄣˊ」頭"], ans: "D", exp: "(A) 悟／晤。(B) 烊／洋。(C) 絞／狡。(D) 淋／淋。" },
  { id: 6, q: "下列選項「」中的注音寫成國字後，哪一組前後相同？", opts: ["(A) 百步穿「ㄧㄤˊ」／「ㄧㄤˊ」眉吐氣", "(B) 無堅不「ㄘㄨㄟ」／自我「ㄘㄨㄟ」眠", "(C) 懸崖「ㄌㄜˋ」馬／寶刀出「ㄑㄧㄠˋ」", "(D) 攻勢「ㄌㄧㄥˊ」厲／「ㄌㄧㄥˊ」晨三點"], ans: "D", exp: "(A) 楊／揚。(B) 摧／催。(C) 勒／鞘。(D) 凌／凌。" },
  { id: 7, q: "下列選項「」中的注音寫成國字後，哪一組前後相同？", opts: ["(A) 「ㄅㄚˊ」山涉水／「ㄅㄚˊ」刀相助", "(B) 耳「ㄊㄧˊ」面命／小「ㄊㄧˊ」大作", "(C) 「ㄘㄜˋ」隱之心／引人「ㄘㄜˋ」目", "(D) 窮困「ㄌㄧㄠˊ」倒／字跡「ㄌㄧㄠˊ」草"], ans: "D", exp: "(A) 跋／拔。(B) 提／題。(C) 惻／側。(D) 潦／潦。" },
  { id: 8, q: "下列選項「」中的注音寫成國字後，哪一組前後相同？", opts: ["(A) 「ㄧㄠˊ」控飛機／「ㄧㄠˊ」尾乞憐", "(B) 氣勢萬「ㄐㄩㄣ」／勢「ㄐㄩㄣ」力敵", "(C) 槍「ㄌㄧㄣˊ」彈雨／「ㄌㄧㄣˊ」漓盡致", "(D) 有恃無「ㄎㄨㄥˇ」／爭先「ㄎㄨㄥˇ」後"], ans: "D", exp: "(A) 遙／搖。(B) 鈞／均。(C) 林／淋。(D) 恐／恐。" },
  { id: 9, q: "下列選項「」中的字，何者字形正確？", opts: ["(A) 神態和「靄」", "(B) 暮「氣」沉沉", "(C) 「偈」見長官", "(D) 筋疲力「竭」"], ans: "D", exp: "(A) 藹。(B) 氣。(C) 謁。(D) 竭。" },
  { id: 10, q: "下列選項「」中的字，何組用字完全正確？", opts: ["(A) 「抨」然心動／大肆「抨」擊", "(B) 「搖」曳生姿／造「搖」生事", "(C) 東施「效」顰／落人「笑」柄", "(D) 暗「箭」傷人／孔明借「箭」"], ans: "D", exp: "(A) 怦／抨。(B) 搖／謠。(C) 效／笑。(D) 箭／箭。" },
  { id: 11, q: "下列成語「」中的字，何者前後用字完全正確？", opts: ["(A) 胼手「脂」足／民「脂」民膏", "(B) 甘之如「飴」／「飴」笑大方", "(C) 盤根錯「節」／「節」哀順變", "(D) 信筆塗「鴨」／雞同「鴨」講"], ans: "C", exp: "(A) 胝／脂。(B) 飴／貽。(C) 節／節。(D) 鴉／鴨。" },
  { id: 12, q: "下列選項「」中的字，何者用字完全正確？", opts: ["(A) 觀者如「睹」／視若無「堵」", "(B) 無堅不「催」／戰火「摧」殘", "(C) 交通樞「紐」／電梯按「鈕」", "(D) 武力「脖」鬥／放手一「博」"], ans: "C", exp: "(A) 堵／睹。(B) 摧／摧。(C) 紐／鈕。(D) 搏／搏。" },
  { id: 13, q: "下列選項「」中的字，何者用字完全正確？", opts: ["(A) 變本加「厲」／再接再「厲」", "(B) 急流「湧」退／波濤洶「湧」", "(C) 避重「咎」輕／動輒得「咎」", "(D) 喜「行」於色／不須此「行」"], ans: "A", exp: "(A) 厲／厲。(B) 勇／湧。(C) 就／咎。(D) 形／虛。" },
  { id: 14, q: "下列文句，何者用字完全正確？", opts: ["(A) 勝券在握", "(B) 意想天開", "(C) 相題並論", "(D) 支字片語"], ans: "A", exp: "(A) 正確。(B) 異。(C) 提。(D) 隻。" },
  { id: 15, q: "下列文句，何者用字完全正確？", opts: ["(A) 房間裡真是紛亂無序，看著堆積如山的陳年舊物，我決定收拾乾淨", "(B) 天色陰霾心情黯淡，精神不濟意志消沉，都曾是我庸懶怠惰的藉口", "(C) 垃圾袋須臾被填滿，我也忙得汗流夾背，雖然棘手卻也有些成就感", "(D) 書堆裡意外發現尋覓已久的日記和照片，繽紛閃躍的回憶迅速湧現"], ans: "A", exp: "(A) 正確。(B) 慵。(C) 浹。(D) 耀。" },
  { id: 16, q: "下列文句，何者用字完全正確？", opts: ["(A) 這部電影育教於樂，十分賣座，深得觀眾喜愛", "(B) 山中的避暑盛地經報導後，夏天時便遊客如織", "(C) 他對於這場鉅變一愁莫展，只能慨嘆生不逢時", "(D) 哥哥通宵達旦準備考試，但結果卻是一塌糊塗"], ans: "D", exp: "(A) 寓。(B) 勝。(C) 籌。(D) 正確。" },
  { id: 17, q: "以下新聞報導，何者用字完全正確？", opts: ["(A) 燈會開始前，南投縣政府重新整修，讓中興新村換然一新。", "(B) 臺灣的主燈一向都是用當年的生肖為設計主軸，每年吸引各國觀光客。", "(C) 將園林美景化作工藝，溶入現代聲光科技，吸引民眾目光。", "(D) 享有舒適、綠色意像的如廁環境，是文明城市的指標。"], ans: "B", exp: "(A) 煥。(B) 正確。(C) 融。(D) 意象。" },
  { id: 18, q: "下列文句，何者字形完全正確？", opts: ["(A) 這座廟宇建築得金壁輝煌，耀睛奪目。", "(B) 我看妳不如一股作氣把這件事做完吧！", "(C) 想要來個以逸代勞，是不可能的事！", "(D) 爺爺雖然年紀大了，卻依然精神矍鑠，神采奕奕。"], ans: "D", exp: "(A) 碧／眼。(B) 鼓。(C) 待。(D) 正確。" },
  { id: 19, q: "下列文句，何者字形完全正確？", opts: ["(A) 既然你誠心問了，我便直言不題了，請見諒。", "(B) 這個產業行情看脹，投資客紛紛搶進。", "(C) 應防患未然將可能孳生病媒蚊的場所清理乾淨。", "(D) 為了不吵醒家人，他走路總有點顳手顳腳。"], ans: "C", exp: "(A) 諱。(B) 漲。(C) 正確。(D) 躡。" },
  { id: 20, q: "下列選項中的文句，何者用字完全正確？", opts: ["(A) 在千均一髮之際，他幸運地逃過一劫。", "(B) 他今天看起來病懨懨的，顯得意興闌姍。", "(C) 不肖的廠商善於利用貪小便宜的人性弱點來蠱惑消費者。", "(D) 師長訓話最好言簡意骸，才能讓人聽進去。"], ans: "C", exp: "(A) 鈞。(B) 珊。(C) 正確。(D) 賅。" },
  { id: 21, q: "下列選項中的文句，何者用字完全正確？", opts: ["(A) 與首獎相較，他只不過稍遜一籌，你又何必如此苛責呢？", "(B) 他在公司服務多年，績效菲然，深獲長官肯定。", "(C) 書法家能夠像戴老那樣蜚聲中外的，實在寥寥無幾。", "(D) 戍守邊疆的官兵長年征戰在外，非常辛苦。"], ans: "A", exp: "(A) 正確。(B) 斐。(C) 正確。(D) 正確。" },
  { id: 22, q: "下列文句，何者用字完全正確？", opts: ["(A) 疫情即使未來趨緩，也難已重回過去。", "(B) 商業航班數量相較去年跌幅已超過八成。", "(C) 如何振興經濟，成為他們觀切的課題。", "(D) 航空公司強調會增加清潔與消毒機艙的頻律。"], ans: "B", exp: "(A) 以。(B) 幅。(C) 關。(D) 率。" },
  { id: 23, q: "下列文句，何者用字完全正確？", opts: ["(A) 他出身富裕家庭，對奢侈浮華的生活早已昔以為常。", "(B) 即使同行競爭激烈，這家老字號的龍頭地位仍就抑立不搖。", "(C) 尚未破曉，登山客便以續勢待發，準備攀登高峰。", "(D) 此地幅員遼闊、水草豐沛，居民多以飼養與屠宰牲畜為業。"], ans: "D", exp: "(A) 習。(B) 屹。(C) 蓄。(D) 正確。" },
  { id: 24, q: "下列文句，何者用字完全正確？", opts: ["(A) 他心愛的寵物走失了，次日一早便四處張貼尋狗啟示。", "(B) 雜誌披露名教授的論文涉及抄襲，在學術界引起軒然大波。", "(C) 燈會上那些匠心獨韻的花燈，令人目不暇給。", "(D) 在這個冷漠的社會中，像你這樣谷道熱腸的人已經不多了。"], ans: "B", exp: "(A) 事。(B) 正確。(C) 運。(D) 古。" },
  { id: 25, q: "下列文句，何者用字完全正確？", opts: ["(A) 古剎中靜肅的木雕佛像，滿是歲月的珠網塵埃。", "(B) 牆上攀附的瓜藤，在深夜步履合緩地遊走探路。", "(C) 即性的樂章從指間輕輕流瀉，令人陶醉。", "(D) 雪花紛飛彷如小精靈，輕盈曼妙地飛舞於天地之間。"], ans: "D", exp: "(A) 蛛。(B) 和。(C) 興。(D) 正確。" },
  { id: 26, q: "下列文句，何者用字完全正確？", opts: ["(A) 往事如電影般，在心的暗室裡反覆撥映。", "(B) 內人備此薄禮相贈，以了表吾家心意。", "(C) 這棟古典建築氣派瑰麗，昔日望族之顯耀可見一斑。", "(D) 到了深夜，田野間的蛙聲便逐漸陳寂下來。"], ans: "C", exp: "(A) 播。(B) 聊。(C) 正確。(D) 沉。" },
  { id: 27, q: "下列文句，何者用字完全正確？", opts: ["(A) 百貨商場招攬書店進駐，兩者相輔相成更能有效吸引客源。", "(B) 連年戰亂，使得百姓過著民不潦生的日子。", "(C) 中華隊在終場以出奇不意的策略擊敗對手。", "(D) 儘管現在擔任後補球員，他依然勤奮練習。"], ans: "A", exp: "(A) 正確。(B) 聊。(C) 其。(D) 候。" },
  { id: 28, q: "下列文句，何者用字完全正確？", opts: ["(A) 戰火波及無辜百姓，城市也只剩斷壁殘垣。", "(B) 民眾紛紛上街抗議，遣責不肖廠商的離譜行徑。", "(C) 原本惡貫滿營的他，經過教化後已改過自新。", "(D) 他生性害羞，面對問題都三兼其口，不願多說。"], ans: "A", exp: "(A) 正確。(B) 譴。(C) 盈。(D) 緘。" },
  { id: 29, q: "下列文句，何者用字完全正確？", opts: ["(A) 歹徒犯下淘天大罪卻毫不內疚。", "(B) 音樂會結束後，那優美的旋律仍不決於耳。", "(C) 這名企業家白手起家、克苦耐勞，終於事業有成。", "(D) 他將料理知識與技藝融會貫通，研發出獨門醬汁配方。"], ans: "D", exp: "(A) 滔。(B) 絕。(C) 刻。(D) 正確。" },
  { id: 30, q: "哪一段文句用字完全正確？", opts: ["(A) 胖虎說他最崇拜歌神張學友高吭的歌聲", "(B) 胖虎說完，立刻放聲高歌，手舞足到地表演起來", "(C) 在一旁的大雄受不了胖虎荒腔走版的歌聲", "(D) 摀起耳朵，直呼：「你真是玷汙了歌神的名號！」"], ans: "D", exp: "(A) 亢。(B) 蹈。(C) 板。(D) 正確。" },
  { id: 31, q: "下列選項「」中的字，何者用字完全正確？", opts: ["(A) 趨之若「鶩」", "(B) 滄海一「素」", "(C) 「復」水難收", "(D) 風聲鶴「厲」"], ans: "A", exp: "(A) 正確。(B) 粟。(C) 覆。(D) 唳。" },
  { id: 32, q: "下列文句，何者用字完全正確？", opts: ["(A) 大家都對他另眼相待", "(B) 這件事讓人莫明奇妙", "(C) 他總是喜歡班門弄斧", "(D) 事情終於撥雲見日"], ans: "D", exp: "(A) 刮目相看／另眼相看。(B) 莫名其妙。(C) 班。(D) 正確。" },
  { id: 33, q: "下列選項「」中的字，何組用字完全正確？", opts: ["(A) 按「步」就班", "(B) 出人「投」地", "(C) 巧「奪」天工", "(D) 文過是「非」"], ans: "C", exp: "(A) 部。(B) 頭。(C) 正確。(D) 飾。" },
  { id: 34, q: "下列文句，何者用字完全正確？", opts: ["(A) 為了準備考試，他每天費寢忘食", "(B) 看到這幅美景，令人留連忘返", "(C) 他們兩人的意見常常南轅北徹", "(D) 這篇文章見解精闢，發人深省"], ans: "D", exp: "(A) 廢。(B) 流。(C) 轍。(D) 正確。" },
  { id: 35, q: "下列各組「」中的字，何者字形前後相同？", opts: ["(A) 令人不「ㄔˇ」／唇亡「ㄔˇ」寒", "(B) 「ㄇㄛˋ」不關心／「ㄇㄛˋ」名奇妙", "(C) 趨之若「ㄨˋ」／好高「ㄨˋ」遠", "(D) 滄海一「ㄙㄨˋ」／不速之「ㄎㄜˋ」"], ans: "A", exp: "(A) 齒／齒。(B) 漠／莫。(C) 鶩／騖。(D) 粟／客。" },
  { id: 36, q: "下列各組「」中的字，何者字形前後相同？", opts: ["(A) 「ㄈㄨˋ」水難收／天翻地「ㄈㄨˋ」", "(B) 「ㄌㄧˋ」兵秣馬／風聲鶴「ㄌㄧˋ」", "(C) 「ㄏㄨㄥˊ」荒之力／驚爪「ㄏㄨㄥˊ」雁", "(D) 「ㄊㄧㄥˇ」而走險／「ㄊㄧㄥˇ」身而出"], ans: "A", exp: "(A) 覆／覆。(B) 厲／唳。(C) 洪／鴻。(D) 鋌／挺。" },
  { id: 37, q: "下列選項「」中的字，何者用字完全正確？", opts: ["(A) 「破」斧沉舟", "(B) 「湛」藍天空", "(C) 「宣」染情緒", "(D) 膾「炙」人口"], ans: "D", exp: "(A) 釜。(B) 湛。(C) 渲。(D) 正確。" },
  { id: 38, q: "下列文句，何者用字完全正確？", opts: ["(A) 他做事總喜歡標新立易，引人注目", "(B) 經過這次教訓，他決定痛改前非", "(C) 這件事處理得非常圓滿，真是皆大歡起", "(D) 他的表現出類拔粹，獲得大家讚賞"], ans: "B", exp: "(A) 異。(B) 正確。(C) 喜。(D) 萃。" },
  { id: 39, q: "下列成語，何者用字完全正確？", opts: ["(A) 迫不急待", "(B) 錙銖必較", "(C) 走頭無路", "(D) 莫名奇妙"], ans: "B", exp: "(A) 迫不及待。(B) 正確。(C) 走投無路。(D) 莫名其妙。" },
  { id: 40, q: "下列文句，何者用字完全正確？", opts: ["(A) 他的演講精采絕倫，贏得滿堂采", "(B) 這座山峰高聳入雲，令人嘆為觀指", "(C) 由於準備不周，這次比賽名落孫山", "(D) 大家都對他的無禮行為感到不齒"], ans: "D", exp: "(A) 彩。(B) 止。(C) 孫。(D) 正確。" },
  { id: 41, q: "下列各組「」中的字，何者字形前後相同？", opts: ["(A) 鞠躬盡「ㄘㄨㄟˋ」／出類拔「ㄘㄨㄟˋ」", "(B) 嬌生「ㄍㄨㄢˋ」養／全神「ㄍㄨㄢˋ」注", "(C) 「ㄏㄨㄢˋ」得ㄏㄨㄢˋ失／容光ㄏㄨㄢˋ發", "(D) 特「殊」／「殊」死戰"], ans: "D", exp: "(A) 瘁／萃。(B) 慣／貫。(C) 患／煥。(D) 殊／殊。" },
  { id: 42, q: "下列選項中的字，何者字形正確？", opts: ["(A) 令人惋「惜」", "(B) 氣喘如「留」", "(C) 「撥」苗助長", "(D) 守株待「免」"], ans: "A", exp: "(A) 正確。(B) 牛。(C) 揠(或拔)。(D) 兔。" },
  { id: 43, q: "下列文句，何者用字完全正確？", opts: ["(A) 經過大雨洗禮，天空顯得特別情朗", "(B) 為了實現夢想，他努力不洩地學習", "(C) 這家餐廳的菜色豐富，令人讚不絕口", "(D) 他的脾氣暴燥，經常與人發生衝突"], ans: "C", exp: "(A) 晴。(B) 懈。(C) 正確。(D) 躁。" },
  { id: 44, q: "下列選項「」中的字，何者前後用字完全正確？", opts: ["(A) 玩世不「躬」", "(B) 剛愎自「用」", "(C) 鋌而走「顯」", "(D) 趨之若「騖」"], ans: "B", exp: "(A) 恭。(B) 正確。(C) 險。(D) 鶩。" },
  { id: 45, q: "下列各組「」中的注音寫成國字後，何者兩兩相同？", opts: ["(A) 精神「ㄏㄨㄢˋ」散／容光「ㄏㄨㄢˋ」發", "(B) 搬弄是「ㄈㄟ」／飛沙走石", "(C) 「ㄈㄨˋ」水難收／天翻地「ㄈㄨˋ」", "(D) 「ㄌㄧˋ」兵秣馬／風聲鶴「ㄌㄧˋ」"], ans: "C", exp: "(A) 渙／煥。(B) 非／飛。(C) 覆／覆。(D) 厲／唳。" },
  { id: 46, q: "下列選項「」中的字，何者字形完全正確？", opts: ["(A) 「提」綱挈領", "(B) 迫不「急」待", "(C) 「旱」牛充棟", "(D) 破釜「沈」舟"], ans: "A", exp: "(A) 正確。(B) 及。(C) 汗。(D) 沉。" },
  { id: 47, q: "下列成語中，何者沒有錯別字？", opts: ["(A) 刻不容緩", "(B) 談笑風聲", "(C) 莫名奇妙", "(D) 走頭無路"], ans: "A", exp: "(A) 正確。(B) 生。(C) 其。(D) 投。" },
  { id: 48, q: "下列成語中，何者沒有錯別字？", opts: ["(A) 破釜沉舟", "(B) 妄自非薄", "(C) 惹事生非", "(D) 穿流不息"], ans: "A", exp: "(A) 正確。(B) 菲。(C) 是。(D) 川。" },
  { id: 49, q: "下列選項中，何者用字完全正確？", opts: ["(A) 既往不究", "(B) 咎由自取", "(C) 動則得咎", "(D) 避重舊輕"], ans: "B", exp: "(A) 咎。(B) 正確。(C) 輒。(D) 就。" },
  { id: 50, q: "下列選項中，何者用字完全正確？", opts: ["(A) 這篇文章文情並貿", "(B) 這件事讓人莫明奇妙", "(C) 他做事總是按部就班", "(D) 面對困難，他總能舉重落輕"], ans: "C", exp: "(A) 茂。(B) 莫名其妙。(C) 正確。(D) 若。" },
  { id: 51, q: "下列四字詞語，何者沒有錯字？", opts: ["(A) 融會貫通", "(B) 榮華副貴", "(C) 孜孜不卷", "(D) 汗流夾背"], ans: "A", exp: "(A) 正確。(B) 富。(C) 倦。(D) 浹。" },
  { id: 52, q: "下列各句中，何者用字完全正確？", opts: ["(A) 經過大家勸解，他終於破悌為笑", "(B) 面對指責，他竟然還敢強詞奪理", "(C) 為了這個計畫，大家已經心力交萃", "(D) 這篇文章文情並茂，令人愛不釋手"], ans: "D", exp: "(A) 涕。(B) 辭。(C) 瘁。(D) 正確。" },
  { id: 53, q: "下列各組字詞，何者沒有錯字？", opts: ["(A) 滿腹經綸／語無輪次", "(B) 戰戰競競／競相模仿", "(C) 堅如磐石／盤根錯節", "(D) 趨之若騖／好高鶩遠"], ans: "C", exp: "(A) 倫。(B) 兢兢。(C) 正確。(D) 鶩／騖。" },
  { id: 54, q: "下列文句，何者用字完全正確？", opts: ["(A) 他的才華在同儕中出類拔萃", "(B) 這項工程浩大，真是巧奪天功", "(C) 他們兩人臭味相投，結為知己", "(D) 他的說詞漏洞百出，簡直是破錠百出"], ans: "A", exp: "(A) 正確。(B) 工。(C) 臭味相投通俗用法。(D) 綻。" },
  { id: 55, q: "下列成語，何者用字完全正確？", opts: ["(A) 惹事生非", "(B) 妄自菲薄", "(C) 錙珠必較", "(D) 汗牛充棟"], ans: "B", exp: "(A) 是。(B) 正確。(C) 銖。(D) 汗牛充棟(正確，但B最無爭議)。" },
  { id: 56, q: "下列選項中，何者用字完全正確？", opts: ["(A) 令人不齒", "(B) 嬌生貫養", "(C) 患得煥失", "(D) 鞠躬盡粹"], ans: "A", exp: "(A) 正確。(B) 慣。(C) 患。(D) 瘁。" },
  { id: 57, q: "下列各組「」中的字，何者前後相同？", opts: ["(A) 令人不「ㄔˇ」／無恥之「ㄔˇ」", "(B) 唇亡「ㄔˇ」寒／令人不「ㄔˇ」", "(C) 玩世不「ㄍㄨㄥ」／鞠「ㄍㄨㄥ」盡瘁", "(D) 剛愎自「ㄩㄥˋ」／備而不用"], ans: "B", exp: "(A) 齒／恥。(B) 齒／齒。(C) 恭／躬。(D) 用／用。" },
  { id: 58, q: "下列各句，何者用字完全正確？", opts: ["(A) 我們必須嚴陣以待", "(B) 實力懸疏的比賽", "(C) 他總是喜歡搬門弄斧", "(D) 行為真是令人髮紙"], ans: "A", exp: "(A) 正確。(B) 殊。(C) 班。(D) 指。" },
  { id: 59, q: "下列選項「」中的字，何者用字完全正確？", opts: ["(A) 不容置「喙」", "(B) 百轉千「迴」", "(C) 國「粹」", "(D) 以上皆是"], ans: "D", exp: "(A) 正確。(B) 正確。(C) 正確。(D) 正確。" },
  { id: 60, q: "下列各組「」中的字，何者字形相同？", opts: ["(A) 不容置「ㄏㄨㄟˋ」／烏鴉鳥「ㄏㄨㄟˋ」", "(B) 「ㄘㄨㄟˋ」煉／國粹「ㄘㄨㄟˋ」", "(C) 「ㄏㄨㄤˇ」然大悟／說謊「ㄏㄨㄤˇ」", "(D) 「ㄑㄩ」之若鶩／並駕齊「ㄑㄩ」"], ans: "A", exp: "(A) 喙／喙。(B) 淬／粹。(C) 恍／謊。(D) 趨／驅。" },
  { id: 61, q: "下列文句，何者用字完全正確？", opts: ["(A) 為了準備考試，他每天挑燈夜站", "(B) 看到這幅美景，令人留連忘反", "(C) 他們兩人的意見常常南轅北轍", "(D) 這篇文章見解精闢，發人深醒"], ans: "C", exp: "(A) 戰。(B) 返。(C) 正確。(D) 省。" },
  { id: 62, q: "下列文句中的詞語，何者用字完全正確？", opts: ["(A) 經過這場大雨，天氣顯得十分情朗", "(B) 這家餐廳的服務無微不至", "(C) 他的脾氣暴燥，容易得罪人", "(D) 哥哥做事總是慢條斯理的，令人急燥"], ans: "B", exp: "(A) 晴朗。(B) 正確。(C) 暴躁。(D) 急躁。" },
  { id: 63, q: "下列選項中的四字詞語，何者沒有錯別字？", opts: ["(A) 令人不恥", "(B) 嬌生貫養", "(C) 迫不及待", "(D) 鞠躬盡粹"], ans: "C", exp: "(A) 齒。(B) 慣。(C) 正確。(D) 瘁。" },
  { id: 64, q: "下列各組字詞，何者沒有錯字？", opts: ["(A) 破釜沉舟／妄自菲薄", "(B) 惹事生非／穿流不息", "(C) 班門弄斧／巧奪天功", "(D) 出人投地／莫名奇妙"], ans: "A", exp: "(A) 正確。(B) 是非 / 川。(C) 工。(D) 頭 / 其。" },
  { id: 65, q: "下列文句，何者用字完全正確？", opts: ["(A) 他的演講精采絕倫，贏得滿堂采", "(B) 高聳入雲，令人嘆為觀指", "(C) 這次比賽名落深山", "(D) 無禮行為令人不齒"], ans: "D", exp: "(A) 彩。(B) 止。(C) 孫。(D) 正確。" },
  { id: 66, q: "下列選項中，何者用字完全正確？", opts: ["(A) 他做事總喜歡標新立異", "(B) 痛改前飛", "(C) 皆大歡起", "(D) 出類拔粹"], ans: "A", exp: "(A) 正確。(B) 非。(C) 喜。(D) 萃。" },
  { id: 67, q: "下列成語，何者用字完全正確？", opts: ["(A) 錙銖必較", "(B) 迫不急待", "(C) 走頭無路", "(D) 莫名奇妙"], ans: "A", exp: "(A) 正確。(B) 及。(C) 投。(D) 其。" },
  { id: 68, q: "下列文句，何者用字完全正確？", opts: ["(A) 經過大雨洗禮，天空顯得特別晴朗", "(B) 努力不洩地學習", "(C) 令人讚不決口", "(D) 脾氣暴燥"], ans: "A", exp: "(A) 正確。(B) 懈。(C) 絕。(D) 躁。" },
  { id: 69, q: "下列文句，何者用字完全正確？", opts: ["(A) 各種跡象一再顯示他有犯罪嫌疑", "(B) 紐約是個交通便利、人口綢密的都市", "(C) 認真負責的態度，是他履創佳績的關鍵", "(D) 你整天遊手好閒，只是突然虛度光陰罷了"], ans: "A", exp: "(A) 正確。(B) 稠。(C) 屢。(D) 徒然。" },
  { id: 70, q: "下列文句，何者用字完全正確？", opts: ["(A) 深夜裡聽著荒誕不經的鬼故事，總覺背後涼蒐蒐的", "(B) 那些獨斷專權且師心自用的人，最後一定會失敗的", "(C) 你怎會如此地糊塗，犯下這等十惡不赦的濤天大罪", "(D) 她從小嬌生貫養，怎麼過得了這種粗茶淡飯的日子"], ans: "B", exp: "(A) 颼颼。(B) 正確。(C) 滔天。(D) 慣養。" },
  { id: 71, q: "下列選項中的字詞，何者去掉部首之後，讀音與原字相同？", opts: ["(A) 邂「逅」", "(B) 「滂」沱", "(C) 「玷」汙", "(D) 油「脂」"], ans: "A", exp: "(A) 逅(ㄏㄡˋ)去辵部為后(ㄏㄡˋ)。(B) 滂(ㄆㄤ)去水部為旁(ㄆㄤˊ)。(C) 玷(ㄉㄧㄢˋ)去玉部為占(ㄓㄢ)。(D) 脂(ㄓ)去肉部為旨(ㄓˇ)。" },
  { id: 72, q: "下列「」中的字以後者代替後，何者意思改變？", opts: ["(A) 阿翔為了趕工，已經好幾天沒「闔」上眼了─合", "(B) 我極力懇求小娟原諒，但她仍無動於「衷」─中", "(C) 公司規定員工統一將識別證別在衣「襟」─巾", "(D) 滿山遍野的杜「鵑」─娟"], ans: "C", exp: "(A) 皆指閉合。(B) 衷、中皆指內心。(C) 襟指衣服胸前部分，巾指擦拭或包裹用布。(D) 鵑為鳥或花，娟為姿態柔美。" },
  { id: 73, q: "下列選項中的成語，何者用字完全正確？", opts: ["(A) 迫不急待", "(B) 走頭無路", "(C) 莫名其妙", "(D) 穿流不息"], ans: "C", exp: "(A) 及。(B) 投。(C) 正確。(D) 川。" },
  { id: 74, q: "下列各組「」中的字，何者字形相同？", opts: ["(A) 創「傷」／重「創」", "(B) 參與／「與」會", "(C) 悶「熱」／繁「悶」", "(D) 「處」理／「處」罰"], ans: "D", exp: "(A) ㄕㄤ／ㄔㄨㄤ。(B) ㄩˇ／ㄩˋ。(C) ㄖㄜˋ／ㄇㄣˋ。(D) ㄔㄨˇ／ㄔㄨˇ。" },
  { id: 75, q: "下列成語，何者用字完全正確？", opts: ["(A) 班門弄斧", "(B) 巧奪天功", "(C) 出人投地", "(D) 莫明奇妙"], ans: "A", exp: "(A) 正確。(B) 工。(C) 頭。(D) 莫名其妙。" },
  { id: 76, q: "下列選項中，何者沒有錯別字？", opts: ["(A) 提綱挈領", "(B) 嬌生貫養", "(C) 患得煥失", "(D) 鞠躬盡粹"], ans: "A", exp: "(A) 正確。(B) 慣。(C) 患。(D) 瘁。" },
  { id: 77, q: "下列選項「」中的字，何者前後用字完全正確？", opts: ["(A) 令人不「恥」", "(B) 唇亡「齒」寒", "(C) 玩世不「躬」", "(D) 剛復自「用」"], ans: "B", exp: "(A) 齒。(B) 正確。(C) 恭。(D) 愎。" },
  { id: 78, q: "下列成語中，何者沒有錯別字？", opts: ["(A) 趨之若鶩", "(B) 滄海一素", "(C) 復水難收", "(D) 風聲鶴厲"], ans: "A", exp: "(A) 正確。(B) 粟。(C) 覆。(D) 唳。" },
];

const QUESTIONS_PER_PAGE = 7;

export default function App() {
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [testMode, setTestMode] = useState("original");
  const [currentQuestions, setCurrentQuestions] = useState(fullQuestionBank);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (testMode === "original") {
      setCurrentQuestions(fullQuestionBank);
    } else {
      const shuffled = [...fullQuestionBank].sort(() => 0.5 - Math.random());
      setCurrentQuestions(shuffled.slice(0, 20));
    }
    setSelectedAnswers({});
    setShowResults(false);
  }, [testMode]);

  const handleSelect = (qId, letter) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = useMemo(() => {
    if (!showResults) return null;
    let correct = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.ans) correct++;
    });
    return correct;
  }, [showResults, selectedAnswers, currentQuestions]);

  const totalPages = Math.ceil(currentQuestions.length / QUESTIONS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-pink-50">
      {/* Control Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b-2 border-pink-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-lg">
            <span className="text-2xl">✨</span> 魔法學園・字形測驗
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Teacher / Student Toggle */}
            <button
              onClick={() => setIsTeacherMode(!isTeacherMode)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                isTeacherMode
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "bg-blue-50 border-blue-300 text-blue-700"
              }`}
            >
              {isTeacherMode ? "🧙 教師版" : "🎓 學生版"}
            </button>
            {/* Mode Select */}
            <select
              className="px-3 py-2 rounded-lg border-2 border-pink-300 bg-pink-50 text-pink-800 text-sm font-medium"
              value={testMode}
              onChange={e => setTestMode(e.target.value)}
            >
              <option value="original">全部 78 題</option>
              <option value="random">隨機抽 20 題</option>
            </select>
            {/* Submit */}
            {!isTeacherMode && !showResults && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow hover:shadow-lg transition-all hover:scale-105"
              >
                交卷批改
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Banner */}
      {showResults && !isTeacherMode && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-lg opacity-90">你的成績</div>
            <div className="text-5xl font-black mt-1">
              {score} / {currentQuestions.length}
            </div>
            <div className="text-sm mt-2 opacity-80">
              正確率 {Math.round((score / currentQuestions.length) * 100)}%
            </div>
            <button
              onClick={() => { setSelectedAnswers({}); setShowResults(false); }}
              className="mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition"
            >
              重新作答
            </button>
          </div>
        </div>
      )}

      {/* Title Card */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="text-center mb-6 pb-4 border-b-2 border-pink-200">
          <h1 className="text-2xl font-black text-indigo-900 tracking-wider">
            ✨ 魔法學園・字形測驗卷 ✨
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            共 {currentQuestions.length} 題 ・ {isTeacherMode ? "教師解析版" : "學生作答版"}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {currentQuestions.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.ans;
          const optLetters = ["A", "B", "C", "D"];

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 transition-all ${
                showResults && userAns
                  ? isCorrect
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-red-300 bg-red-50/30"
                  : "border-slate-200 hover:border-pink-200"
              }`}
            >
              {/* Question Text */}
              <div className="flex gap-2 mb-3">
                <span className="font-black text-indigo-600 min-w-[2rem]">
                  {idx + 1}.
                </span>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {q.q}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 ml-8">
                {q.opts.map((opt, oi) => {
                  const letter = optLetters[oi];
                  const isSelected = userAns === letter;
                  const isAnswer = q.ans === letter;

                  let optStyle = "border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer";

                  if (isTeacherMode && isAnswer) {
                    optStyle = "border-pink-400 bg-pink-50 text-pink-800 font-bold";
                  } else if (showResults) {
                    if (isSelected && isCorrect) {
                      optStyle = "border-emerald-400 bg-emerald-50 text-emerald-800 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optStyle = "border-red-400 bg-red-50 text-red-700 font-bold line-through";
                    } else if (isAnswer) {
                      optStyle = "border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold";
                    } else {
                      optStyle = "border-slate-200 bg-slate-50 opacity-60";
                    }
                  } else if (isSelected) {
                    optStyle = "border-indigo-400 bg-indigo-50 text-indigo-800 font-semibold ring-2 ring-indigo-300";
                  }

                  return (
                    <div
                      key={oi}
                      onClick={() => !isTeacherMode && handleSelect(q.id, letter)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${optStyle}`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {/* Explanation (teacher mode or after submit) */}
              {(isTeacherMode || (showResults && userAns)) && (
                <div className="mt-3 ml-8 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg text-sm">
                  <span className="font-bold text-indigo-700">
                    【解答：{q.ans}】
                  </span>
                  <span className="text-slate-700 ml-2">{q.exp}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
