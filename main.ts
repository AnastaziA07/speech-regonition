// Thai Speech Recognition สำหรับ micro:bit v2
// ใช้ไมโครโฟนและลำโพงในตัว ไม่ต้องใช้โมดูลเสริม

// กำหนดคำสั่งภาษาไทย (ใช้การเปลี่ยนเป็นเสียงอังกฤษใกล้เคียง)
interface ThaiCommandMap {
    [key: string]: string
}

let thaiCommands: ThaiCommandMap = {
    "fire-bert": "ไฟเปิด",      // ไฟเปิด
    "fire-pit": "ไฟปิด",        // ไฟปิด  
    "yoot": "หยุด",             // หยุด
    "rerm": "เริ่ม",            // เริ่ม
    "chai": "ใช่",              // ใช่
    "mai": "ไม่",               // ไม่
    "kwaa": "ขวา",              // ขวา
    "saai": "ซ้าย",             // ซ้าย
    "keun": "ขึ้น",             // ขึ้น
    "long": "ลง"                // ลง
}

// ฟังก์ชันสำหรับแปลงเสียงพูดเป็นข้อความ (ใช้ไมโครโฟนในตัว)
function listenForCommand(): string {
    try {
        // แสดงสัญลักษณ์ฟัง
        basic.showIcon(IconNames.Pitchfork)

        // ใช้ไมโครโฟนในตัวของ micro:bit v2
        input.setSoundThreshold(SoundThreshold.Loud, 150)

        // รอจนกว่าจะมีเสียงดัง
        while (!input.soundLevel()) {
            basic.pause(100)
        }

        // บันทึกเสียง 2 วินาที
        basic.showIcon(IconNames.Square)
        let audioData: number[] = []

        // อ่านค่าเสียงจากไมโครโฟนในตัว
        for (let i = 0; i < 20; i++) {  // 2 วินาที (100ms x 20)
            let soundLevel = input.soundLevel()
            audioData.push(soundLevel)
            basic.pause(100)
        }

        // จำลองการประมวลผล Speech Recognition
        // ในการใช้งานจริงจะส่งไปยัง Cloud API
        let averageSound = 0
        for (let level of audioData) {
            averageSound += level
        }
        averageSound = averageSound / audioData.length

        // แปลงระดับเสียงเป็นคำสั่ง (ตัวอย่างง่ายๆ)
        if (averageSound > 200) {
            return "fire-bert"  // เสียงดังมาก = "ไฟเปิด"
        } else if (averageSound > 100) {
            return "fire-pit"   // เสียงปานกลาง = "ไฟปิด"
        } else {
            return ""
        }

    } catch (error) {
        basic.showIcon(IconNames.Sad)
        return ""
    }
}

// ฟังก์ชันประมวลผลคำสั่งภาษาไทย
function processThaiCommand(recognizedText: string): void {
    if (!recognizedText) {
        return
    }

    // หาคำสั่งที่ตรงกัน
    let thaiWord = thaiCommands[recognizedText]

    if (thaiWord) {
        basic.showString(thaiWord, 150)

        // ประมวลผลคำสั่ง
        if (thaiWord == "ไฟเปิด") {
            basic.showIcon(IconNames.Yes)
            // เปิด LED และเล่นเสียงยืนยัน
            pins.digitalWritePin(DigitalPin.P0, 1)
            music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ไฟปิด") {
            basic.showIcon(IconNames.No)
            // ปิด LED และเล่นเสียงยืนยัน
            pins.digitalWritePin(DigitalPin.P0, 0)
            music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ใช่") {
            basic.showIcon(IconNames.Happy)
            music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ไม่") {
            basic.showIcon(IconNames.Sad)
            music.play(music.builtinPlayableSoundEffect(soundExpression.twinkle), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ขวา") {
            basic.showLeds(`
                . . # . .
                . # . # .
                # . . . #
                . # . # .
                . . # . .
                `)
            // เล่นเสียง beep สั้น
            music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ซ้าย") {
            basic.showLeds(`
                . . # . .
                . # . # .
                # . . . #
                . # . # .
                . . # . .
                `)
            music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ขึ้น") {
            basic.showLeds(`
                . . # . .
                . # # # .
                # . # . #
                . . # . .
                . . # . .
                `)
            music.play(music.builtinPlayableSoundEffect(soundExpression.spring), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "ลง") {
            basic.showLeds(`
                . . # . .
                . . # . .
                # . # . #
                . # # # .
                . . # . .
                `)
            music.play(music.builtinPlayableSoundEffect(soundExpression.slide), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "หยุด") {
            basic.showIcon(IconNames.Square)
            // เสียงหยุด
            music.play(music.builtinPlayableSoundEffect(soundExpression.mysterious), music.PlaybackMode.UntilDone)

        } else if (thaiWord == "เริ่ม") {
            basic.showIcon(IconNames.Target)
            // เสียงเริ่มต้น
            music.play(music.builtinPlayableSoundEffect(soundExpression.soaring), music.PlaybackMode.UntilDone)
        }

        basic.pause(2000)
    } else {
        basic.showIcon(IconNames.Confused)
        // เล่นเสียงแสดงว่าไม่เข้าใจคำสั่ง
        music.play(music.builtinPlayableSoundEffect(soundExpression.mysterious), music.PlaybackMode.UntilDone)
    }
}

// ฟังก์ชันเล่นเสียงตอบรับภาษาไทย (ใช้เสียง beep แทนคำพูด)
function playThaiResponse(command: string): void {
    // เล่นเสียงตอบกลับตามคำสั่งภาษาไทย
    // เนื่องจาก micro:bit ไม่สามารถพูดภาษาไทยได้ จึงใช้เสียง beep แทน

    if (command == "ไฟเปิด") {
        // เสียง beep ยาว 2 ครั้ง = เปิดแล้ว
        for (let i = 0; i < 2; i++) {
            music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
            basic.pause(200)
        }
    } else if (command == "ไฟปิด") {
        // เสียง beep สั้น 1 ครั้ง = ปิดแล้ว
        music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)

    } else if (command == "ใช่") {
        // เสียงสูงขึ้น = ใช่
        music.play(music.builtinPlayableSoundEffect(soundExpression.spring), music.PlaybackMode.UntilDone)

    } else if (command == "ไม่") {
        // เสียงต่ำลง = ไม่
        music.play(music.builtinPlayableSoundEffect(soundExpression.slide), music.PlaybackMode.UntilDone)
    }
}

// ฟังก์ชันบันทึกเสียงจากไมโครโฟนในตัว
function recordAudio(): number[] {
    // บันทึกเสียงจากไมโครโฟนในตัวของ micro:bit v2
    basic.showIcon(IconNames.Pitchfork)

    // เริ่มบันทึกเสียงจากไมโครโฟนในตัว
    let audioBuffer: number[] = []

    // บันทึก 3 วินาที
    for (let i = 0; i < 30; i++) {
        // อ่านระดับเสียงจากไมโครโฟนในตัว
        let soundSample = input.soundLevel()
        audioBuffer.push(soundSample)
        basic.pause(100)
    }

    basic.showIcon(IconNames.Yes)
    return audioBuffer
}

// ฟังก์ชันตรวจจับเสียงสำหรับเริ่มการบันทึก
function waitForVoiceTrigger(): boolean {
    // รอให้มีเสียงพูดก่อนเริ่มบันทึก
    basic.showIcon(IconNames.SmallHeart)

    // ตั้งค่าเกณฑ์เสียงสำหรับการเริ่มบันทึก
    input.setSoundThreshold(SoundThreshold.Loud, 150)

    // รอจนกว่าจะตรวจพบเสียงดัง
    while (true) {
        if (input.soundLevel() > 150) {
            return true
        }
        basic.pause(50)
    }
}

// ========== การตั้งค่าไมโครโฟนในตัว ==========

// ฟังก์ชันเริ่มต้นการตั้งค่าไมโครโฟน
function setupMicrophone(): void {
    // ตั้งค่าเริ่มต้นสำหรับไมโครโฟนในตัว
    // ตั้งค่าระดับเสียงที่ถือว่าเป็น "เสียงดัง"
    input.setSoundThreshold(SoundThreshold.Loud, 200)
    input.setSoundThreshold(SoundThreshold.Quiet, 50)

    basic.showString("Mic Ready", 100)
}

// ========== การใช้งานลำโพงในตัวของ micro:bit v2 ==========

// ฟังก์ชันปรับแต่งระดับเสียง
function setVolumeLevel(): void {
    // ปรับระดับเสียงลำโพงในตัว
    // (แม้เสียงจะไม่ค่อยชัด แต่ยังใช้งานได้)

    // ตั้งค่าระดับเสียงปานกลาง
    music.setVolume(128)  // 0-255 (128 = กึ่งกลาง)

    // ทดสอบเสียง
    basic.showString("Sound Test", 100)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
}

// ฟังก์ชันสร้างเสียง beep แบบกำหนดเอง
function customBeep(frequency: number = 1000, duration: number = 200): void {
    // สร้างเสียง beep ด้วยความถี่และระยะเวลาที่กำหนด
    // (สำหรับตอบกลับคำสั่งเฉพาะ)

    // ใช้ทำนองสั้นๆ แทน
    music.playTone(frequency, duration)
}

// ========== เคล็ดลับปรับปรุงคุณภาพเสียง ==========
function improveSoundQuality(): void {
    // เคล็ดลับปรับปรุงเสียงจากลำโพงในตัว

    // 1. ปรับระดับเสียงให้เหมาะสม (ไม่สูงเกินไป)
    music.setVolume(100)

    // 2. ใช้เสียงสั้นๆ แทนเสียงยาว
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)  // สั้น ชัดกว่า
    basic.pause(100)

    // 3. หลีกเลี่ยงเสียงความถี่สูงมาก
    // เสียงความถี่กลางจะชัดกว่า

    // 4. วางมือหรือวัตถุเป็นโค้งใต้ micro:bit 
    // จะช่วยขยายเสียงให้ดังและชัดขึ้น
}

// ========== ฟังก์ชันส่งข้อมูลไป Cloud API ==========
function sendToCloudAPI(audioData: number[]): string {
    // ส่งข้อมูลเสียงไปยัง Google Cloud Speech API
    // หรือ Azure Speech Services ที่รองรับภาษาไทย

    try {
        // เตรียมข้อมูลเสียง (จำลอง)
        basic.showIcon(IconNames.Diamond)
        basic.pause(1000)

        // รับผลลัพธ์กลับมา (จำลอง)
        return "ไฟเปิด"  // ผลลัพธ์จำลอง

    } catch (error) {
        basic.showIcon(IconNames.No)
        return ""
    }
}

// ========== ฟังก์ชันหลัก ==========
function main(): void {
    basic.showString("Thai Speech Ready", 100)
    // เล่นเสียงเริ่มต้น
    music.play(music.builtinPlayableSoundEffect(soundExpression.soaring), music.PlaybackMode.UntilDone)

    // ตั้งค่าเริ่มต้น
    setupMicrophone()
    setVolumeLevel()

    while (true) {
        basic.showIcon(IconNames.SmallHeart)  // แสดงว่าพร้อมฟัง

        // รอคำสั่งเสียง
        let command = listenForCommand()

        if (command) {
            // ประมวลผลคำสั่ง
            processThaiCommand(command)
        } else {
            // ไม่เข้าใจคำสั่ง
            music.play(music.builtinPlayableSoundEffect(soundExpression.mysterious), music.PlaybackMode.UntilDone)
        }

        basic.pause(500)
    }
}

// ========== การจัดการเหตุการณ์ปุ่ม ==========

// กดปุ่ม A เพื่อทดสอบคำสั่ง "ไฟเปิด"
input.onButtonPressed(Button.A, function () {
    processThaiCommand("fire-bert")
})

// กดปุ่ม B เพื่อทดสอบคำสั่ง "ไฟปิด"
input.onButtonPressed(Button.B, function () {
    processThaiCommand("fire-pit")
})

// กดปุ่ม A+B เพื่อเริ่มการฟังคำสั่ง
input.onButtonPressed(Button.AB, function () {
    basic.showString("Listening...", 100)
    let command = listenForCommand()
    if (command) {
        processThaiCommand(command)
    }
})

// เริ่มโปรแกรม
main()