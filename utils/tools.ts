import images from "images";
import TextToSVG from "text-to-svg";
import svg2png from "svg2png";
const textToSVG = TextToSVG.loadSync("./fonts/yh.ttf");
type CbType = (fileName:string)=> unknown
/**
 * 根据文字生成图片
 * @param txt   需要生成的文字
 * @param cb    生成之后的回调函数
 */
async function initImg(txt:string, cb:CbType) {
  txt = txt.trim();
  let w = Math.max(...txt.split("\n").map((item) => item.length)) * 80; // 计算宽度，换行分割之后取最大宽度作为图片最终的宽度
  let h = txt.split("\n").length * 164; // 计算高度，换行分割后的行数*每一行的高度

  // 每一个文字进行分割生成svg图片
  const txtPromise = txt.split("").map((item) => {
    const svg1 = textToSVG.getSVG(item, {
      x: 0,
      y: 0,
      fontSize: 20,
      anchor: "top",
    });
    return svg2png(Buffer.from(svg1), {});
  });
  // 所有生成png的Promise对象放在一个Promise.all数组中,等所有的svg都生成之后把结果一起进行绘制
  const txtImgs = await Promise.all(txtPromise)
  const result = images(w, h).fill(255,255,255); // 最终绘制的结果
  let xIndex = 0;
  let yIndex = 0;
  txtImgs.forEach((p, index) => {
    if (txt.split("")[index] == "\n") {
      yIndex += 1;
      xIndex = 0;
    } else {
      result.draw(
        images(
          `./images/QP4a5rvW_${Math.floor(Math.random() * 40)}.png`
        ).draw(images(p).rotate(35), 22, 12),
        xIndex * 80,
        yIndex * 164
      );
      xIndex += 1;
    }
  });
  const fileName = Math.random() + ".png";
  result.save(`./public/${fileName}`);
  cb(fileName);
}

export default initImg
