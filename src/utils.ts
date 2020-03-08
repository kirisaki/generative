export const hsvToRgbHex = (H: number , S: number, V:number): string => {
    const C = V * S
    const Hp = H / 60
    const X = C * (1 - Math.abs(Hp % 2 - 1))

    let [R, G, B] = [0, 0, 0]
    if (0 <= Hp && Hp < 1){
      [R,G,B]=[C,X,0]
    }else if(1 <= Hp && Hp < 2){
      [R,G,B]=[X,C,0]
    }else if(2 <= Hp && Hp < 3){
      [R,G,B]=[0,C,X]
    }else if(3 <= Hp && Hp < 4){
      [R,G,B]=[0,X,C]
    }else if(4 <= Hp && Hp < 5){
      [R,G,B]=[X,0,C]
    }else if(5 <= Hp && Hp < 6){
      [R,G,B]=[C,0,X]
    }

    const m = V - C;
    [R, G, B] = [R+m, G+m, B+m]

    R = Math.floor(R * 255)
    G = Math.floor(G * 255)
    B = Math.floor(B * 255)

    const f = (x: number): string => ('00' + x.toString(16)).slice(-2)
    return ('#' + f(R) + f(G) + f(B))
}
