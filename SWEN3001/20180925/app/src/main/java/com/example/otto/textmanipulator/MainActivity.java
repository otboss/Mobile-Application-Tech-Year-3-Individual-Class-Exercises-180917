package com.example.otto.textmanipulator;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    Button solutionButton = findViewById(R.id.solutionButton);
    final TextView input = findViewById(R.id.inputTextArea);
    final String txt = (String) input.getText();
    final TextView solutionTextView = findViewById(R.id.solutionTextArea);

    public int wordCount(String text){
        return text.split(" ").length;
    }

    public int[] bestWidth(String text){
        String[] splittedText = text.split("\n");
        input.measure(0, 0);
        int inputWidth = input.getMeasuredWidth();
        int bestWidth = inputWidth;
        int[] longestRiver = new int[]{0,0};/*index 0 for max flow, index 1 for best width*/
        for(int x = inputWidth; x > 0; x--){
            splittedText = text.split("\n");
            //COMPLETE HERE
        }
        return longestRiver;
    }

    public String resultText(String text){
        return " ";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        solutionButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView solutionText = findViewById(R.id.solutionDetails);
                solutionText.setText("Total words: "+wordCount(txt)+" Best Width: "+bestWidth(txt)[1]+" Max flows: "+bestWidth(txt)[0]);
                solutionTextView.setText(resultText(txt));
            }
        });
    }
}
