package com.example.otto.simplewebview;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final TextView searchbox = findViewById(R.id.searchbox);
        TextView searchbtn = findViewById(R.id.searchbtn);
        final WebView resultWebview = findViewById(R.id.resultWebview);

        searchbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resultWebview.setWebViewClient(new WebViewClient());
                String url = (String) searchbox.getText();
                resultWebview.loadUrl(url);
            }
        });
    }
}
